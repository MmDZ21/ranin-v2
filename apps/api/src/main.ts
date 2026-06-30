import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');

  // Security headers. CSP is disabled because this is a JSON API (and so the
  // dev-only Swagger UI renders); transport/sniffing/framing headers stay on.
  app.use(helmet({ contentSecurityPolicy: false }));

  // Bound JSON/urlencoded body sizes (file uploads are handled by multer limits).
  app.use(json({ limit: '2mb' }));
  app.use(urlencoded({ extended: true, limit: '2mb' }));

  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist strips unknown properties (prevents mass-assignment, e.g.
      // injecting `role`). We deliberately do NOT forbidNonWhitelisted so that
      // existing clients sending extra fields are not hard-rejected.
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  // CORS: explicit allowlist from env (comma-separated). Never reflect arbitrary
  // origins while credentials are enabled.
  const origins = (config.get<string>('CORS_ORIGINS') ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({
    origin: origins.length > 0 ? origins : false,
    credentials: true,
  });

  // Run onModuleDestroy (pg pool drain) on SIGTERM/SIGINT.
  app.enableShutdownHooks();

  if (config.get<string>('NODE_ENV') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Ranin API')
      .setDescription(
        'E-commerce API for industrial electrical protection relays',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = config.get<number>('PORT') ?? 3333;
  await app.listen(port);
  logger.log(`API listening on http://localhost:${port}/api`);
}

void bootstrap();
