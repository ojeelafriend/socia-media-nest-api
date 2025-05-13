import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { AuthenticateDto } from './dto/authenticate.dto';
import { EncrypterService } from './encrypter/encrypter.service';
import { JwtService } from './jwt/jwt.service';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly encrypterService: EncrypterService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  async authenticate(
    @Res() response: Response,
    @Body() authenticateDto: AuthenticateDto,
  ) {
    const { error, user } = await this.authService.findOne({
      email: authenticateDto.email,
    });

    if (error || !user) {
      return response.status(401).json({ ok: false, error });
    }

    const isMatch = await this.encrypterService.matchPassword({
      password: authenticateDto.password,
      passwordHashed: user.password,
    });

    if (!isMatch) {
      return response
        .status(401)
        .json({ ok: isMatch, error: `Invalid email or password` });
    }

    const payload = {
      sub: user.userId,
      username: user.username,
      photo: user.photo,
    };

    const { token } = await this.jwtService.createToken(payload);

    if (!token) {
      return response
        .status(404)
        .json({ ok: false, error: `Invalid email or password` });
    }

    return response.status(200).json({ ok: isMatch, token });
  }
}
