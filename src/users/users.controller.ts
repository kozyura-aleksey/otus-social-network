import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto, RegisterDto } from './dto/index.dto';

@Controller('')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/login')
  async login(@Body() dto: LoginDto) {
    return await this.usersService.login(dto);
  }

  @Post('/register')
  async register(@Body() dto: RegisterDto) {
    return await this.usersService.register(dto);
  }

  @Get('user/:id')
  async getUserById(@Param('id') id: number) {
    return await this.usersService.getUserById(id);
  }
}
