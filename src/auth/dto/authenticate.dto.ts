import { IsEmail, IsString } from 'class-validator';

export class AuthenticateDto {
  @IsEmail()
  email: string;

  @IsString({ message: `Invalid email or password` })
  password: string;
}
