import { Injectable } from '@nestjs/common';
import { JwtService as JwtServiceClass } from '@nestjs/jwt';

interface Payload {
  sub: string;
  username: string;
  photo: string;
}

@Injectable()
export class JwtService {
  constructor(private jwtService: JwtServiceClass) {}

  async createToken(payload: Payload) {
    try {
      const token = await this.jwtService.signAsync(payload);
      return { token };
    } catch (error) {
      return { token: false };
    }
  }
}
