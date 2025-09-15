import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class UsersService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async getUserById(id: number) {
    const client = await this.pool.connect();

    try {
      const user = await client.query('SELECT * FROM users WHERE id = $1', [
        id,
      ]);
      return user.rows;
    } catch (e) {
      console.log(e);
      throw new NotFoundException();
    }
  }

  async login() {}

  async register() {}
}
