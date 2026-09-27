import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  // Habilitamos CORS restringido según reglas de seguridad D-009
  app.enableCors({
    origin: (origin, callback) => {
      const allowed = [
        'http://localhost:4200',
        'http://127.0.0.1:4200',
        process.env['FRONTEND_URL'],
      ].filter(Boolean) as string[];

      if (
        !origin ||
        allowed.includes(origin) ||
        (process.env['NODE_ENV'] !== 'production' &&
          /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+):4200$/.test(origin))
      ) {
        callback(null, true);
      } else {
        callback(new Error('Acceso no autorizado por política CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('RateMat API')
    .setDescription('API para la plataforma de evaluación de profesores de la UCAB')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env['PORT'] || 3001;
  await app.listen(port);
  console.log(`RateMat API listening on port ${port}`);
}
bootstrap();
