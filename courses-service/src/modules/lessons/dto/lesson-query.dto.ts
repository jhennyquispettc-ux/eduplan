import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class LessonQueryDto {
  @ApiProperty({
    format: 'uuid',
    description: 'Módulo al que pertenecen las lecciones',
  })
  @IsUUID()
  moduleId: string;
}
