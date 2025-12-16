import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('post')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Post('create')
  async create() {}

  @Put('update')
  async update() {}

  @Delete('delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {}

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {}

  @Get('feed')
  async feed() {}
}
