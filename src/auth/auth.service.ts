import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOne({ email }: { email: string }) {
    try {
      const user = await this.userRepository.findOneBy({ email });

      if (!user) {
        return { error: `Invalid email or password`, user: null };
      }

      return { error: false, user: user };
    } catch (error) {
      console.log(error);
      return { error: `Invalid email or password`, user: null };
    }
  }
}
