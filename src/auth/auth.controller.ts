import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto, RegisterDto } from 'src/users/dto/index.dto';
import { UsersService } from 'src/users/users.service';

@Controller()
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/login')
  async login(@Body() dto: LoginDto) {
    return await this.usersService.login(dto);
  }

  @Post('/register')
  async register(@Body() dto: RegisterDto) {
    return await this.usersService.register(dto);
  }
}
