import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Response } from 'express';

import { EncrypterService } from './encrypter/encrypter.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly encrypterService: EncrypterService,
  ) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res() response: Response,
  ) {
    const { password } = createUserDto;

    const passwordHashed = await this.encrypterService.hashPassword(password);

    const { error, user } = await this.usersService.create(
      createUserDto,
      passwordHashed,
    );

    if (error) {
      return response.status(404).json({ ok: false, error });
    }

    return response.status(201).json({ ok: true, user });
  }

  @Get()
  async findAll(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Res() response: Response,
  ) {
    const { error, users, details } = await this.usersService.findAll({
      limit,
      page,
    });

    if (error) {
      return response.status(404).json({ ok: false, error });
    }

    return response.status(200).json({ ok: true, users, details });
  }

  @Get(':username')
  async findOne(
    @Param('username') username: string,
    @Res() response: Response,
  ) {
    const { error, user } = await this.usersService.findOne(username);

    if (error) {
      return response.status(404).json({ ok: false, error });
    }

    return response.status(200).json({ ok: true, user });
  }

  @Patch(':userId')
  async update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() response: Response,
  ) {
    const { error, user } = await this.usersService.update(
      userId,
      updateUserDto,
    );

    if (error) {
      return response.status(404).json({ ok: false, error });
    }

    return response
      .status(200)
      .json({ ok: true, message: `User updated`, user });
  }

  @Delete(':userId')
  async remove(@Param('userId') userId: string, @Res() response: Response) {
    const { error, message } = await this.usersService.remove(userId);

    if (error) {
      return response.status(404).json({ ok: false, error });
    }

    return response.status(200).json({ ok: true, message });
  }
}
