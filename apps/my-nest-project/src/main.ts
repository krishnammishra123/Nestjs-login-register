import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as appRoot from 'app-root-path';

async function bootstrap() {
  config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useStaticAssets(path.join(appRoot.path, 'uploads'));
  await app.listen(3000);
}
bootstrap();
