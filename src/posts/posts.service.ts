import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Pool } from 'pg';

@Injectable()
export class PostsService {
  constructor(
    @Inject('PG_POOL_MASTER') private poolMaster: Pool,
    @Inject('PG_POOL_SLAVE') private poolSlave: Pool,
    private jwtService: JwtService,
  ) {}

  async createPost() {}

  async updatePost() {}

  async deletePost() {}

  async getPost() {}
}
