// src/auth/email/email.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Types } from 'mongoose';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailVerifyToken {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      // Replace with your SMTP configuration
      service: 'Gmail',
      auth: {
        user: 'krishnammishra1426@gmail.com',
        pass: 'kxbdfdrxafmarerc',
      },
    });
  }

  async sendVerificationToken( email: string,token: string,userId:Types.ObjectId,): Promise<{ message: string }> {
    try {
      const mailOptions = {
        from: 'krishnammishra1426@gmail.com',
        to: email,
        subject: 'Email Verification',
        text: `Dear User,\n\nYou have requested to reset your password for your account. Please click on the link below to reset your password:\n\n ${process.env.BASE_URL}/forgetpassword/${userId}/${token}\n\nIf you didn't request this password reset, please ignore this email.\n\nThanks,\nThe Team`,
      };
      await this.transporter.sendMail(mailOptions);
      return { message: 'Reset password email sent successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error sending the reset password email:',error,);
    }
  }
}
