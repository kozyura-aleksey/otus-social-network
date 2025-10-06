import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY || 'SECRET',
      signOptions: {
        expiresIn: process.env.EXPIRE_IN || '30m',
      },
    }),
  ],
  providers: [UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
