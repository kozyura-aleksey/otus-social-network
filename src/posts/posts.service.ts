import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { Pool } from 'pg';
import { REDIS_CLIENT } from 'src/redis/redis.provider';
import { query } from 'src/utils/query';
import { FeedDto } from './dto/feed.dto';

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

  async feed(current_user_id: number, dto: FeedDto) {
    const key = `feed:user:${current_user_id}`;
    const offset = dto?.offset ?? 0;
    const limit = dto?.limit ?? 20;

    try {
      let cachedPosts = await this.redis.zrevrange(
        key,
        offset,
        offset + limit - 1,
      );
      if (!cachedPosts || cachedPosts.length === 0) {
        const posts = await query(
          this.poolMaster,
          `SELECT p.*
           FROM posts p
           JOIN friends f ON p.user_id = f.friend_id
           WHERE f.user_id = $1
           ORDER BY p.id DESC
           LIMIT 1000`,
          [current_user_id],
        );

        if (posts.length > 0) {
          const zaddArgs: (string | number)[] = [];
          posts.forEach((p) => {
            zaddArgs.push(p.id, JSON.stringify(p));
          });
          await this.redis.zadd(key, ...zaddArgs);
          await this.redis.expire(key, 60 * 50); // TTL 50 минут
        }

        cachedPosts = posts
          .slice(offset, offset + limit)
          .map((p) => JSON.stringify(p));
      }

      return cachedPosts.map((p) => JSON.parse(p));
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }
}
