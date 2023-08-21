import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

// Helper function to get the file extension
function getExtension(filename: string): string | undefined {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : undefined;
}

export const fileUploadMiddleware = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const ext = getExtension(file.originalname);
      if (!ext) {
        // Handle error when the extension cannot be determined
        return cb(new Error('Invalid file extension'), '');
      }

      const uniqueName = `aa${uuidv4().replaceAll('-', '')}.${ext}`;
      cb(null, uniqueName); //file.originalname
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(png|webp|jpg|jpeg)$/)) {
      //jpg|jpeg|png|gif|
      return cb(
        new BadRequestException('Only Image files (png,webp,jpg,jpeg) are allowed.'), // Filter only specific file types
        false,
      );
    }
    cb(null, true);
  },
};
