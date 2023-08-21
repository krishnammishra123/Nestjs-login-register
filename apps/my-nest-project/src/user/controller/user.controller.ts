import { BadRequestException, Body, Controller, Get, Post, Request, SetMetadata, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../../guard/auth.guard';
import { UserService } from '../service/user.service';
import { RolesGuard } from '../../guard/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadMiddleware } from '../FileUploadMiddleware/FileUploadMiddleware';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('verifyuser')
  @UseGuards(AuthGuard, RolesGuard)
  @SetMetadata('role', ['user'])
  async getUserProfile(@Request() req) {
    return this.userService.userProfile(req.email);
  }

  @Post("uploadImage")
  @UseInterceptors(FileInterceptor('file', fileUploadMiddleware))
  async imageupload(@UploadedFile() file: Express.Multer.File,) {
      if (!file) {
        throw new BadRequestException('No file uploaded.');
      }
 
    return await this.userService.uploadFile(file.filename);
   }
}
