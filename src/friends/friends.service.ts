import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Pool } from 'pg';
import { query } from 'src/utils/query';

@Injectable()
export class FriendsService {
  constructor(
    @Inject('PG_POOL_MASTER') private poolMaster: Pool,
    @Inject('PG_POOL_SLAVE') private poolSlave: Pool,
    private jwtService: JwtService,
  ) {}

  async addFriend(current_user_id: number, friend_id: number) {
    if (current_user_id === friend_id) {
      throw new BadRequestException();
    }

    try {
      await query(
        this.poolMaster,
        `INSERT INTO friends(user_id, friend_id)
        VALUES ($1, $2)`,
        [current_user_id, friend_id],
      );
      return 'Успешно создан пост';
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async deleteFriend(current_user_id: number, friend_id: number) {
    if (current_user_id === friend_id) {
      throw new BadRequestException();
    }

    try {
      await query(
        this.poolMaster,
        `DELETE FROM friends where 
         current_user_id = $1 and  friend_id = $2`,
        [current_user_id, friend_id],
      );
      return 'Успешно создан пост';
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }
}
