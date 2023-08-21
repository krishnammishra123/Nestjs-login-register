// src/auth/email/email.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
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

  async sendVerificationEmail(email: string,token: string): Promise<{ message: string }> {
    try {
      const mailOptions = {
        from: 'krishnammishra1426@gmail.com',
        to: email,
        subject: 'Email Verification',
        text: `Please click the following link to verify your email:\n\n ${process.env.BASE_URL}/emailVerify/${token}`,
      };

      await this.transporter.sendMail(mailOptions);
       return { message: 'Verification email sent successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Error sending verification email:', error);
    }
  }
}
