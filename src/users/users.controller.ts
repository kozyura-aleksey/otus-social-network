import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { SearchQuery } from './dto/index.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('user/:id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.getUserById(id);
  }

  @Get('users/search')
  async searchUser(@Query() query: SearchQuery) {
    return await this.usersService.search(query);
  }
}
