import { ApiProperty } from '@nestjs/swagger';
import { CourseDetailDto } from './course-detail.dto.js';

export class CourseExportDto {
  static readonly SCHEMA_VERSION = 1;

  @ApiProperty({
    example: CourseExportDto.SCHEMA_VERSION,
    description:
      'Versión del formato, para que la app offline sepa cómo leerlo',
  })
  schemaVersion: number;

  @ApiProperty({ example: '2026-10-18T12:00:00.000Z' })
  exportedAt: string;

  @ApiProperty({ type: CourseDetailDto })
  course: CourseDetailDto;

  static fromDetail(course: CourseDetailDto): CourseExportDto {
    const dto = new CourseExportDto();
    dto.schemaVersion = CourseExportDto.SCHEMA_VERSION;
    dto.exportedAt = new Date().toISOString();
    dto.course = course;
    return dto;
  }
}
