import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Pool } from 'pg';
import { query } from 'src/utils/query';

@Injectable()
export class DialogsService {
  constructor(
    @Inject('PG_POOL_MASTER') private poolMaster: Pool,
    @Inject('PG_POOL_SLAVE') private poolSlave: Pool,
    private jwtService: JwtService,
  ) {}

  async sendMessage(current_user_id: number, text: string, friend_id: number) {
    const client = await this.poolMaster.connect();

    try {
      await client.query('BEGIN');
      const user1 = current_user_id;
      const user2 = friend_id;

      const { rows: conversationRows } = await client.query(
        `
        INSERT INTO conversations (user_id, friend_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        RETURNING id
        `,
        [user1, user2],
      );

      let conversationId: number;

      if (conversationRows.length) {
        conversationId = conversationRows[0].id;
      } else {
        const { rows } = await client.query(
          `
          SELECT id
          FROM conversations
          WHERE LEAST(user_id, friend_id)::bigint = $1
          AND GREATEST(user_id, friend_id)::bigint = $2
          `,
          [user1, user2],
        );
        conversationId = rows[0].id;
      }

      await client.query(
        `
        INSERT INTO messages (conversation_id, sender_id, message, created_at)
        VALUES ($1, $2, $3, NOW())
        `,
        [conversationId, current_user_id, text],
      );

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      console.error(e);
      throw new BadRequestException();
    } finally {
      client.release();
    }
  }

  async getDialog(current_user_id: number, friend_id: number) {
    try {
      const user1 = Math.min(current_user_id, friend_id);
      const user2 = Math.max(current_user_id, friend_id);

      const conversations = await query(
        this.poolMaster,
        `
        SELECT id
        FROM conversations
        WHERE user_id = $1 AND friend_id = $2
        `,
        [user1, user2],
      );

      if (!conversations.length) {
        return [];
      }

      const conversationId = conversations[0].id;

      const messages = await query(
        this.poolMaster,
        `
        SELECT id, sender_id, message, created_at
        FROM messages
        WHERE conversation_id = $1
        ORDER BY created_at ASC
        `,
        [conversationId],
      );

      return messages;
    } catch (e) {
      console.error(e);
      throw new BadRequestException();
    }
  }
}
