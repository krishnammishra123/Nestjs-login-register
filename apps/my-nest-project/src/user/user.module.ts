import { Module } from '@nestjs/common';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { AuthGuard } from '../guard/auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../auth/schema/user.Schema';
import { RolesGuard } from '../guard/role.guard';
import { FileSchema } from './schema/fileUpload.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: 'File', schema: FileSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, AuthGuard, RolesGuard],
})
export class UserModule {}
