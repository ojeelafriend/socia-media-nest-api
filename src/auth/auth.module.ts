import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { EncrypterService } from './encrypter/encrypter.service';
import { JwtService } from './jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({ global: true, secret: jwtConstants.secret }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EncrypterService, JwtService],
})
export class AuthModule {}
