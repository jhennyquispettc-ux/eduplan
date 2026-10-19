import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CourseStatus } from '../enums/course-status.enum.js';

export class UpdateCourseStatusDto {
  @ApiProperty({ enum: CourseStatus, enumName: 'CourseStatus' })
  @IsEnum(CourseStatus)
  status: CourseStatus;
}
