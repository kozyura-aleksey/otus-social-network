import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DialogsService } from './dialogs.service';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UserResponse } from 'src/users/dto/index.response';
import { SendMessageDto } from './dto/send.message.dto';

@Controller('dialog')
@UseGuards(JwtAuthGuard)
export class DialogsController {
  constructor(private readonly dialogsService: DialogsService) {}

  @Post(':id/send')
  async sendMessage(
    @CurrentUser() user: UserResponse,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SendMessageDto,
  ) {
    await this.dialogsService.sendMessage(user.id, dto.text, id);
  }

  @Get(':id/list')
  async getDialog(
    @CurrentUser() user: UserResponse,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.dialogsService.getDialog(user.id, id);
  }
}
