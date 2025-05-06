import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const { content, authorId, writtenByAI } = createPostDto;

    try {
      await this.postRepository.save({
        content,
        userId: authorId,
        writtenByAI,
      });
      return { ok: true, content };
    } catch (err) {
      console.log(err);
      return { ok: false, content: '' };
    }
  }

  async findAll() {
    try {
      const result = await this.postRepository.find();
      return { ok: true, posts: result };
    } catch (err) {
      console.log(err);
      return { ok: false, posts: [] };
    }
  }

  async findOne({ userId, postId }: { userId: string; postId: string }) {
    try {
      const posts = await this.postRepository.findBy({ userId, postId });
      return { ok: true, posts };
    } catch (error) {
      return { ok: false, posts: [] };
    }
  }

  async update(postId: string, updatePostDto: UpdatePostDto) {
    try {
      const post = await this.postRepository
        .createQueryBuilder()
        .update(Post)
        .set({ content: updatePostDto.content })
        .where('postId = :postId', { postId })
        .execute();

      console.log(post);
    } catch (error) {
      console.log(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
