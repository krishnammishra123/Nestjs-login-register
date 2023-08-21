import { NestFactory } from '@nestjs/core';
import { MyAppModule } from './my-app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
config();


async function bootstrap() {
  const app = await NestFactory.create(MyAppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(3000);
}
bootstrap();
