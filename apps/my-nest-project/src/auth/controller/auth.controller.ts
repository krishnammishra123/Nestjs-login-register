import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from '../dto/createUser.dto';
import { LoginUserDto } from '../dto/loginUser.dto';
import { ForgetPasswordDto } from '../dto/forgetPassword.dto';
import { ResetPasswordDto } from '../dto/resetPassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUsers(createUserDto);
  }

  @Post('login')
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUsers(loginUserDto);
  }

  @Post('forgetpassword')
  async forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.authService.forgetsPassword(forgetPasswordDto);
  }

  @Get('verifyforgetpassword/:id/:token')
  async verifyToken(@Param('id') id: string, @Param('token') token: string) {
    return this.authService.verifyToken(id, token);
  }

  @Post('resetpassword/:id/:token')
  async  resetPassword(@Body() resetPasswordDto:ResetPasswordDto,@Param('id') id: string, @Param('token') token: string) {
    return this.authService.resetPassword(id, token, resetPasswordDto);
  }

  @Get('emailVerify/:token')
  async verifyEmailToken(@Param('token') token: string) {
    return this.authService.verifyEmail(token);
  }
}
