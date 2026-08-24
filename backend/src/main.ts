import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilitamos CORS según reglas de seguridad D-009
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
