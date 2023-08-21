import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import Document from "next/document";

export type UserDocument = User & Document;

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: '011f' })
  emailVerifyToken: string;

  @Prop({ default: false }) // Add isEmailVerified field with default value false
  isEmailVerified: boolean;

  @Prop({ default: UserRole.USER }) // Set the default role to 'user'
  role: string;

  @Prop()
  verifytoken: string;
}

export const UserSchema=SchemaFactory.createForClass(User)