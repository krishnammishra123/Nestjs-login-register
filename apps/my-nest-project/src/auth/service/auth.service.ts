import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schema/user.Schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { EmailService } from '../../emailNodemailer/email.service';
import { LoginUserDto } from '../dto/loginUser.dto';
import { ForgetPasswordDto } from '../dto/forgetPassword.dto';
import { CreateUserDto } from '../dto/createUser.dto';
import { EmailVerifyToken } from '../../emailNodemailer/emailforgetPassword.service';
import { ResetPasswordDto } from '../dto/resetPassword.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly emailVerifyToken: EmailVerifyToken,
  ) {}

  //Register User
  async createUsers(createUserDto: CreateUserDto) {
    try {
      const { name, email, password } = createUserDto;
      var token = Buffer.from(email).toString('base64');
      token = token.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
      const existUser = await this.userModel.findOne({ email });
      if (existUser) {
        throw new ConflictException('User already exists');
      } else {
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new this.userModel({
          name,
          email,
          password: hashPassword,
          emailVerifyToken: token,
          isEmailVerified: false,
          role: 'user',
        });
        await newUser.save();
        const data = await this.emailService.sendVerificationEmail(
          email,
          token,
        );
        return { message: data.message };
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Something Is Wrong');
      }
    }
  }

  // Verify Email
  async verifyEmail(token: string) {
    try {
      const user = await this.userModel.findOne({ emailVerifyToken: token });
      if (user) {
        user.isEmailVerified = true;
        user.emailVerifyToken = null;
        await user.save();
        return { message: 'Email verified successfully' };
      } else {
        throw new NotFoundException('User not authorized');
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Something went wrong while verifying email',
        );
      }
    }
  }


  //login
  async loginUsers(loginUserDto: LoginUserDto) {
    try {
      const { email, password } = loginUserDto;
      const existUser = await this.userModel.findOne({ email });
      if (!existUser) {
        throw new NotFoundException('user not found');
      }
      if (existUser.isEmailVerified === false) {
        throw new UnauthorizedException('Email id not verified');
      }
      const isMatch = await bcrypt.compare(password, existUser?.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid Crediantial');
      } else {
        const token = this.jwtService.sign({
          id: existUser._id,
          email: existUser.email,
          role: existUser.role,
        });
        const userDetails = {
          id: existUser._id,
          name: existUser.name,
          email: existUser.email,
          role: existUser.role,
        };
        return { message: 'Login  successful', token, userDetails };
      }
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      } else {
        throw new InternalServerErrorException('Something Is Wrong');
      }
    }
  }

  //forgetPassword
  async forgetsPassword(forgetPasswordDto: ForgetPasswordDto) {
    try {
      const { email } = forgetPasswordDto;
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const token = this.jwtService.sign({
        id: user._id,
        email: user.email,
        role: user.role,
      });
      const setusertoken = await this.userModel.findByIdAndUpdate(
        { _id: user._id },
        { verifytoken: token },
        { new: true },
      );
      const details = await this.emailVerifyToken.sendVerificationToken(
        user.email,
        setusertoken.verifytoken,
        setusertoken._id,
      );
      return details;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Something went wrong while verifying email',
        );
      }
    }
  }

  //verify reset Password Token
  async verifyToken(id: string, token: string) {
    try {
      const user = await this.userModel.findOne({_id: id,verifytoken: token});
      const decodedToken =await this.jwtService.verify(token);
      if (user && decodedToken.id) {
        return { message: 'User verifyToken succesfully' };
      } else {
        throw new UnauthorizedException('Unauthorized: User not found');
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Something went wrong while verify Token');
      }
    }
  }

  //verify reset Password Token
  async resetPassword(id: string, token: string, resetPasswordDto:ResetPasswordDto) {
    try {
      const { password } = resetPasswordDto;
      const user = await this.userModel.findOne({_id: id,verifytoken: token});
      const decodedToken = this.jwtService.verify(token);
      if (user && decodedToken.id) {
        const newPassword = await bcrypt.hash(password, 10);
        const setnewuserpassword = await this.userModel.findByIdAndUpdate({ _id: id }, { password: newPassword }, { new: true });
        setnewuserpassword.save();
        return { message: 'Account has been setup successfully.Please login' };
      } else {
        throw new UnauthorizedException('Unauthorized: User not found');
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Something went wrong while resetPassword',);
      }
    }
  }


}
