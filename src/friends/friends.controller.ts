import { Controller, Delete, Param, ParseIntPipe, Put } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UserResponse } from 'src/users/dto/index.response';

@Controller('friend')
export class FriendsController {
  constructor(private readonly friendService: FriendsService) {}

  @Put('set/:id')
  async addFriend(
    @CurrentUser() user: UserResponse,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.friendService.addFriend(user.id, id);
  }

  @Delete('delete/:id')
  async deleteFriend(
    @CurrentUser() user: UserResponse,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.friendService.deleteFriend(user.id, id);
  }
}
