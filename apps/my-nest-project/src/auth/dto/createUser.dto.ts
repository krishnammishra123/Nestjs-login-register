import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name should not be empty' })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Name should contain only letters and spaces',
  })
  name: string;

  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty()
  // @Length(8, 12, { message: 'Password must be between 8 and 12 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      'Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, and one digit',
  })
  password: string;

  // emailVerifyToken: string;

  // isEmailVerified: boolean;

  // role: string;

  // verifytoken: string;
}
