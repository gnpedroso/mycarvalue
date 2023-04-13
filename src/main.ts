import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // Make sure that any aditional property will be ignored in a request
      whitelist: true
    })
  )
  await app.listen(3000);
}
bootstrap();
