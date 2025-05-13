import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Response } from 'express';
import { AuthGuard } from './guards/auth/auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Res() response: Response,
  ) {
    const { ok, content } = await this.postsService.create(createPostDto);

    if (!ok) {
      return response.status(404).json({ ok, error: `Not found` });
    }

    return response
      .status(201)
      .json({ ok, message: `Post created`, post: { content } });
  }

  @Get()
  async findAll(@Res() response: Response) {
    const { ok, posts } = await this.postsService.findAll();
    if (!ok) {
      return response.status(404).json({ ok, error: `Posts not found` });
    }

    return response.status(200).json({ ok, posts });
  }

  @Get('_search')
  async findOne(
    @Query('userId') userId: string,
    @Query('postId') postId: string,
    @Res() response: Response,
  ) {
    const { ok, posts } = await this.postsService.findOne({ userId, postId });

    if (!ok) {
      return response.status(404).json({ ok, error: `Not found` });
    }
    return response.status(200).json({ ok, posts });
  }

  @UseGuards(AuthGuard)
  @Patch(':postId')
  update(
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(postId, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
