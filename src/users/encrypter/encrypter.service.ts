import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';

@Injectable()
export class EncrypterService {
  async hashPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }
}
