import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication, path: string): void {
  const config = new DocumentBuilder()
    .setTitle('EDUPLAN - courses-service')
    .setDescription('Categorías, carreras, cursos, módulos y lecciones')
    .setVersion('1.0')
    .build();

  SwaggerModule.setup(path, app, SwaggerModule.createDocument(app, config));
}
