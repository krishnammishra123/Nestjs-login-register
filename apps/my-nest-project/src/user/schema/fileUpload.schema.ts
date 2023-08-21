import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileDocument = fileUpload & Document;

@Schema()
export class fileUpload {
  @Prop({ required: true })
  File: string;
}

export const FileSchema = SchemaFactory.createForClass(fileUpload);
