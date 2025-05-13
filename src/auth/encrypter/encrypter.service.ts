import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';

@Injectable()
export class EncrypterService {
  async matchPassword({
    password,
    passwordHashed,
  }: {
    password: string;
    passwordHashed: string;
  }) {
    return await compare(password, passwordHashed);
  }
}
