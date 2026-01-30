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
    try {
      await query(
        this.poolMaster,
        `INSERT INTO friends(user_id, friend_id)
              VALUES ($1, $2)`,
        [current_user_id, friend_id],
      );
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async getDialog(current_user_id: number, friend_id: number) {
    try {
      await query(
        this.poolMaster,
        `INSERT INTO friends(user_id, friend_id)
              VALUES ($1, $2)`,
        [current_user_id, friend_id],
      );
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }
}
