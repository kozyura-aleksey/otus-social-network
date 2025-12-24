import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { Pool } from 'pg';
import { REDIS_CLIENT } from 'src/redis/redis.provider';
import { query } from 'src/utils/query';

@Injectable()
export class PostsService {
  constructor(
    @Inject('PG_POOL_MASTER') private poolMaster: Pool,
    @Inject('PG_POOL_SLAVE') private poolSlave: Pool,
    private jwtService: JwtService,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  async createPost(current_user_id: number, text: string) {
    try {
      await query(
        this.poolMaster,
        `INSERT INTO posts(text, user_id)
              VALUES ($1, $2)`,
        [text, current_user_id],
      );
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async updatePost(current_user_id: number, text: string, post_id: number) {
    try {
      await query(
        this.poolMaster,
        `update posts
        set text = $1 
        where user_id = $2 and id = $3`,
        [current_user_id, text, post_id],
      );
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async deletePost(current_user_id: number, post_id: number) {
    try {
      await query(
        this.poolMaster,
        `delete from posts
              where user_id = $1 and id = $2`,
        [current_user_id, post_id],
      );
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async getPost(current_user_id: number, post_id: number) {
    try {
      await query(
        this.poolMaster,
        `SELECT from posts
              where user_id = $1 and id = $2`,
        [current_user_id, post_id],
      );
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async feed(current_user_id: number, offset: number, limit: number) {
    try {
      await query(
        this.poolMaster,
        `SELECT p.*
          FROM posts p
          JOIN friends f
          ON p.user_id = f.friend_id
        WHERE f.user_id = $1
        ORDER BY p.id DESC
        LIMIT $2 OFFSET $3`,
        [current_user_id, limit, offset],
      );
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }
}
