import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { UserResponse } from 'src/users/dto/index.response';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create.post';
import { UpdatePostDto } from './dto/update.post.dto';
import { identity } from 'rxjs';
import { FeedDto } from './dto/feed.dto';

@Controller('post')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Post('create')
  async create(@CurrentUser() user: UserResponse, @Body() dto: CreatePostDto) {
    return await this.postService.createPost(user.id, dto.text);
  }

  @Put('update')
  async update(@CurrentUser() user: UserResponse, @Body() dto: UpdatePostDto) {
    return await this.postService.updatePost(user.id, dto.text, dto.id);
  }

  @Delete('delete/:id')
  async delete(
    @CurrentUser() user: UserResponse,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.postService.deletePost(user.id, id);
  }

  @Get('get/:id')
  async get(
    @CurrentUser() user: UserResponse,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.postService.getPost(user.id, id);
  }

  @Get('feed')
  async feed(@CurrentUser() user: UserResponse, @Body() dto: FeedDto) {
    return await this.postService.feed(user.id, dto.limit, dto.offset);
  }
}
