import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Pool } from 'pg';
import { query } from 'src/utils/query';

@Injectable()
export class DialogsService {
  constructor(
    @Inject('PG_POOL_COORDINATOR') private poolCoordinator: Pool,
    private jwtService: JwtService,
  ) {}

  async sendMessage(current_user_id: number, text: string, friend_id: number) {
    const client = await this.poolCoordinator.connect();

    try {
      await client.query('BEGIN');

      const user1 = Math.min(current_user_id, friend_id);
      const user2 = Math.max(current_user_id, friend_id);

      await client.query(`SELECT pg_advisory_xact_lock($1, $2)`, [
        user1,
        user2,
      ]);

      const { rows } = await client.query(
        `
        SELECT id
        FROM conversations
        WHERE user_id = $1 AND friend_id = $2
        LIMIT 1
        `,
        [user1, user2],
      );

      let conversationId: number;

      if (rows.length === 0) {
        const insert = await client.query(
          `
          INSERT INTO conversations (user_id, friend_id)
          VALUES ($1, $2)
          RETURNING id
          `,
          [user1, user2],
        );
        conversationId = insert.rows[0].id;
      } else {
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
        this.poolCoordinator,
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
        this.poolCoordinator,
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
