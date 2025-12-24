import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY || 'SECRET',
      signOptions: {
        expiresIn: process.env.EXPIRE_IN || '30m',
      },
    }),
  ],
  providers: [FriendsService],
  controllers: [FriendsController],
})
export class FriendsModule {}
