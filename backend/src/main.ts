import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
  origin: [
    'https://tp22-77653.web.app',
    'https://tp22-77653.firebaseapp.com',
    'http://localhost:4200',
  ],
  credentials: true,
});
  //app.enableCors({ origin: true, credentials: true });
  //app.enableCors({
  //  origin: ['https://tp22-77653.web.app', 'https://tp22-77653.firebaseapp.com', 'http://localhost:4200'],
  //  credentials: true,
  //});
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
