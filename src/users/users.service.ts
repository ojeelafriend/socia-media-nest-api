import { IPaginationMeta, paginate } from 'nestjs-typeorm-paginate';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

type userExposed = {
  username: string;
  photo: string;
  bio: string;
  createdAt: Date;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto, passwordHashed) {
    const { email, photo, username } = createUserDto;
    try {
      const emailExists = await this.userRepository.findOneBy({ email });

      const usernameExists = await this.userRepository.findOneBy({ username });

      if (emailExists) {
        return { error: `Email already exists`, users: {} };
      }

      if (usernameExists) {
        return { error: `Username already exists`, users: {} };
      }

      const user = await this.userRepository.save({
        email,
        photo,
        username,
        password: passwordHashed,
      });

      console.log(user);

      return { error: false, user: { username: user.username, bio: user.bio } };
    } catch (error) {
      console.log(error);
      return { error: `Fail creation user, try again more later`, user: {} };
    }
  }

  async findAll({ limit, page }: { limit: number; page: number }): Promise<{
    error: string | boolean;
    users: userExposed[] | [];
    details: IPaginationMeta | {};
  }> {
    try {
      const queryBuild = this.userRepository
        .createQueryBuilder('user')
        .orderBy('user.username', 'DESC');

      const { items, meta, links } = await paginate<User>(queryBuild, {
        limit,
        page,
      });

      return {
        error: false,
        users: items.map(({ username, createdAt, bio, photo }) => ({
          username,
          photo,
          createdAt,
          bio,
        })),
        details: meta,
      };
    } catch (error) {
      console.log(error);
      return { error: `Not founds`, users: [], details: {} };
    }
  }

  async findOne(
    username: string,
  ): Promise<{ error: string | boolean; user: userExposed | {} }> {
    try {
      const user = await this.userRepository.findOneBy({ username });

      if (!user) return { error: `User not found`, user: {} };

      return {
        error: false,
        user: {
          username: user.username,
          bio: user.bio,
          createdAt: user.createdAt,
          photo: user.photo,
        },
      };
    } catch (error) {
      console.log(error);
      return { error: `User not found`, user: {} };
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    try {
      const { bio, photo } = updateUserDto;
      const userUpdated = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({ bio, photo })
        .where('userId = :userId', { userId })
        .execute();

      return { error: false, user: userUpdated };
    } catch (error) {
      console.log(error);
      return { error, user: {} };
    }
  }

  async remove(userId: string) {
    try {
      const userExists = await this.userRepository.findOneBy({ userId });

      if (!userExists) {
        return { error: `User not found ${userId}`, message: '' };
      }

      await this.userRepository
        .createQueryBuilder()
        .where('userId = :userId', { userId })
        .delete()
        .execute();

      return { errror: false, message: `User deleted ${userId}` };
    } catch (error) {
      console.log(error);
      return { error, message: '' };
    }
  }
}
