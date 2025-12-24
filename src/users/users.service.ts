import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Pool } from 'pg';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto, SearchQuery } from './dto/index.dto';
import * as bcrypt from 'bcryptjs';
import { UserResponse } from './dto/index.response';
import { query } from 'src/utils/query';

@Injectable()
export class UsersService {
  constructor(
    @Inject('PG_POOL_MASTER') private poolMaster: Pool,
    @Inject('PG_POOL_SLAVE') private poolSlave: Pool,
    private jwtService: JwtService,
  ) {}

  private async generateToken(user): Promise<string> {
    const payload = { email: user.email, id: user.id, name: user.first_name };
    return this.jwtService.sign(payload);
  }

  async getUserById(id: number): Promise<UserResponse> {
    try {
      const user = await query(
        this.poolMaster,
        'SELECT first_name, last_name, birth_date, gender, interests, city FROM users WHERE id = $1',
        [id],
      );
      if (!user.length) {
        throw new NotFoundException();
      }
      return user[0];
    } catch (e) {
      console.log(e);
      throw new NotFoundException();
    }
  }

  async getUserByEmail(email: string): Promise<UserResponse> {
    try {
      const user = await query(
        this.poolMaster,
        'SELECT * FROM users WHERE email = $1',
        [email],
      );
      if (!user) {
        throw new NotFoundException();
      }
      return user[0];
    } catch (e) {
      console.log(e);
      throw new NotFoundException();
    }
  }

  async login(dto: LoginDto): Promise<{ token: string }> {
    try {
      const user = await this.getUserByEmail(dto.email);
      return {
        token: await this.generateToken(user),
      };
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async register(dto: RegisterDto): Promise<{ id: number; token: string }> {
    try {
      const findUser = await this.getUserByEmail(dto.email);
      if (findUser) {
        throw new BadRequestException();
      }

      const hashPassword = await bcrypt.hash(dto.password, 5);

      await query(
        this.poolMaster,
        `INSERT INTO users (first_name, last_name, birth_date, gender, interests, city, email, password) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          dto.first_name,
          dto.last_name,
          dto.birth_date,
          dto.gender,
          dto.interests,
          dto.city,
          dto.email,
          hashPassword,
        ],
      );

      const user = await this.getUserByEmail(dto.email);

      return {
        id: user.id,
        token: await this.generateToken(user),
      };
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async search(queryIn: SearchQuery): Promise<UserResponse[] | []> {
    try {
      const user = await query(
        this.poolMaster,
        `SELECT id, first_name, last_name, birth_date, gender, city FROM users 
        WHERE first_name LIKE $1 AND last_name LIKE $2
        order by id asc`,
        [`${queryIn.first_name}%`, `${queryIn.last_name}%`],
      );
      return user;
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }
}
