import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgetPasswordDto {

  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
    
}