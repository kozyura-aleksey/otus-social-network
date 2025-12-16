import { Controller, Delete, Param, ParseIntPipe, Put } from '@nestjs/common';
import { FriendsService } from './friends.service';

@Controller('friend')
export class FriendsController {
  constructor(private readonly friendService: FriendsService) {}

  @Put('set/:id')
  async addFriend(@Param('id', ParseIntPipe) id: number) {
    return await this.friendService.addFriend();
  }

  @Delete('delete/:id')
  async deleteFriend(@Param('id', ParseIntPipe) id: number) {
    return await this.friendService.deleteFriend();
  }
}
