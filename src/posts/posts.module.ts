import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY || 'SECRET',
      signOptions: {
        expiresIn: process.env.EXPIRE_IN || '30m',
      },
    }),
  ],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
