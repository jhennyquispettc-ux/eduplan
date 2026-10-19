import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CourseModuleQueryDto {
  @ApiProperty({
    format: 'uuid',
    description: 'Curso al que pertenecen los módulos',
  })
  @IsUUID()
  courseId: string;
}
