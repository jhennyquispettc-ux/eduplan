import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { AppConfig } from './config/services/app.config.js';
import { setupSwagger } from './config/swagger.setup.js';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfig);

  app.setGlobalPrefix(config.apiPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const docsPath = `${config.apiPrefix}/docs`;
  if (!config.isProduction) setupSwagger(app, docsPath);

  await app.listen(config.port);

  const url = `http://localhost:${config.port}`;
  Logger.log(
    `courses-service listening on ${url}/${config.apiPrefix}`,
    'Bootstrap',
  );
  if (!config.isProduction)
    Logger.log(`Swagger available at ${url}/${docsPath}`, 'Bootstrap');
}
await bootstrap();
