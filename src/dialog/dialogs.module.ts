import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DialogsController } from './dialogs.controller';
import { DialogsService } from './dialogs.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY || 'SECRET',
      signOptions: {
        expiresIn: process.env.EXPIRE_IN || '30m',
      },
    }),
  ],
  providers: [DialogsService],
  controllers: [DialogsController],
})
export class DialogsModule {}
