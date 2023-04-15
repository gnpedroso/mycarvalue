import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    keys: ['ey34o312p8']
  }))
  app.useGlobalPipes(
    new ValidationPipe({
      // Make sure that any aditional property will be ignored in a request
      whitelist: true
    })
  )
  await app.listen(3000);
}
bootstrap();
