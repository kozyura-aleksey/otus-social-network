import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { Pool } from 'pg';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/index.dto';
import * as bcrypt from 'bcryptjs';
import { UserResponse } from './dto/index.response';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @Inject('PG_POOL') private pool: Pool,
    private jwtService: JwtService,
  ) {}

  // универсальный метод для запросов
  private async query<T = any>(sql: string, params?: any[]): Promise<T[]> {
    const client = await this.pool.connect();
    try {
      const { rows } = await client.query(sql, params);
      return rows;
    } finally {
      client.release();
    }
  }

  private async createTableUser() {
    await this.query(`CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    birth_date DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    interests TEXT,
    city VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(255) NOT NULL
    );`);
  }

  async onModuleInit() {
    await this.createTableUser();
    console.log('Users table is ready');
  }

  private async generateToken(user): Promise<string> {
    const payload = { email: user.email, id: user.id, name: user.first_name };
    return this.jwtService.sign(payload);
  }

  async getUserById(id: number): Promise<UserResponse> {
    try {
      const user = await this.query(
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
      const user = await this.query('SELECT * FROM users WHERE email = $1', [
        email,
      ]);
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

      await this.query(
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
}
