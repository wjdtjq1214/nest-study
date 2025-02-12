import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.SERVER_PORT ?? 3001);
  Logger.log(
    `Server Start Port: ${process.env.SERVER_PORT ?? 3001} Env: ${process.env.NODE_ENV}`,
  );
}
bootstrap();
