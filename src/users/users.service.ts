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
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    interests TEXT,
    city VARCHAR(100),
    password VARCHAR(255) NOT NULL
    );`);
  }

  async onModuleInit() {
    await this.createTableUser();
    console.log('Users table is ready');
  }

  private async generateToken(user) {
    const payload = { email: user.email, id: user.id, name: user.name };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async getUserById(id: number) {
    try {
      const user = await this.query('SELECT * FROM users WHERE id = $1', [id]);
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch (e) {
      console.log(e);
      throw new NotFoundException();
    }
  }

  async getUserByName(name: string) {
    try {
      const user = await this.query('SELECT * FROM users WHERE name = $1', [
        name,
      ]);
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch (e) {
      console.log(e);
      throw new NotFoundException();
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.query('SELECT * FROM users WHERE email = $1', [
        dto.email,
      ]);
      return this.generateToken(user);
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }

  async register(dto: RegisterDto) {
    try {
      const findUser = await this.getUserByName(dto.first_name);
      if (findUser) {
        throw new BadRequestException();
      }

      const hashPassword = await bcrypt.hash(dto.password, 5);

      await this.query(
        `INSERT INTO users (first_name, last_name, birth_date, gender, interests, city, password) 
        values $1, $2, $3, $4, $5, $6, $7 `[
          (dto.first_name,
          dto.last_name,
          dto.birth_date,
          dto.gender,
          dto.interests,
          dto.city,
          hashPassword)
        ],
      );

      const user = await this.query(
        'SELECT * FROM users WHERE first_name = $1',
        [dto.first_name],
      );

      if (!user) {
        throw new NotFoundException();
      }
      return this.generateToken(user);
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }
}
