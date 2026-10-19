import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { AppConfig } from './config/services/app.config.js';
import { GatewayConfig } from './config/services/gateway.config.js';
import { buildCorsOptions } from './config/cors.options.js';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter.js';
import { notFoundHandler } from './shared/http/not-found.handler.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  const config = app.get(AppConfig);
  const gateway = app.get(GatewayConfig);

  app.setGlobalPrefix(config.apiPrefix);
  app.enableCors(buildCorsOptions(config.corsOrigins));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableShutdownHooks();

  await app.init();
  app.use(notFoundHandler);
  await app.listen(config.port);

  const logger = new Logger('Bootstrap');
  logger.log(
    `api-gateway listening on http://localhost:${config.port}/${config.apiPrefix}`,
  );
  for (const [name, url] of Object.entries(gateway.upstreams)) {
    logger.log(`${name} -> ${url}`);
  }
}
await bootstrap();
