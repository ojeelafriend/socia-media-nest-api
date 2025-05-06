import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Min,
  IsStrongPassword,
  Equals,
  IsHash,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Min(4)
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  photo: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @Equals('password', {
    message: 'Password and Confirm password do not match',
  })
  confirmPassword: string;
}
