import {  IsNotEmpty,  Matches } from 'class-validator';

export class ResetPasswordDto {
 

  @IsNotEmpty({ message: 'Password should not be empty' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, { message:
      'Password must be at least 8 characters long, and contain at least one uppercase letter, one lowercase letter, and one digit',
  })
  password: string;
}
