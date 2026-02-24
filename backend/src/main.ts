import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api'); // Set API route prefix
  app.enableCors(); // Allow origins (frontend)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
// Trigger restart
