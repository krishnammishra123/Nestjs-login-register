import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { User, UserSchema } from './schema/user.Schema';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from '../emailNodemailer/email.service';
import { EmailVerifyToken } from '../emailNodemailer/emailforgetPassword.service';
 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: `${process.env.JWT_SECRET_KEY}`,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, EmailVerifyToken],
})
export class AuthModule {}
