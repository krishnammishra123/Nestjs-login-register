import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../../auth/schema/user.Schema';
import { Model } from 'mongoose';
import { FileDocument } from '../schema/fileUpload.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel('File') private fileModel: Model<FileDocument>,
  ) {}

  async userProfile(email: string) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('User Not Found');
      }
      const userDetail = {
        id: user?._id,
        name: user?.name,
        email: user?.email,
        role: user.role,
      };
      return userDetail;
    } catch (error) {
      throw new InternalServerErrorException('Something is wrong');
    }
  }

  async uploadFile(File: string) {
    const newFile = new this.fileModel({ File: File });
    const details = await newFile.save();
    const fileURL = `${process.env.BASE_URL}/${details.File}`;
    return { message: 'Uploaded file successfully!', fileURL };
  }
}
