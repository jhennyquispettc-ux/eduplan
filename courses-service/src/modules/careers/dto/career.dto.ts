import { ApiProperty } from '@nestjs/swagger';
import { Career } from '../entities/career.entity.js';

export class CareerDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Medicina' })
  name: string;

  @ApiProperty({
    type: String,
    nullable: true,
    example: 'Estudio, diagnóstico y tratamiento de enfermedades',
  })
  description: string | null;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  static fromEntity(entity: Career): CareerDto {
    const dto = new CareerDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.createdAt = entity.createdAt.toISOString();
    dto.updatedAt = entity.updatedAt.toISOString();
    return dto;
  }
}
