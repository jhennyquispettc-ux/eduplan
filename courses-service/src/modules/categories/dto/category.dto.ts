import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../entities/category.entity.js';

export class CategoryDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Matemáticas' })
  name: string;

  @ApiProperty({
    type: String,
    nullable: true,
    example: 'Álgebra, trigonometría y cálculo básico',
  })
  description: string | null;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;

  static fromEntity(entity: Category): CategoryDto {
    const dto = new CategoryDto();
    dto.id = entity.id;
    dto.name = entity.name;
    dto.description = entity.description;
    dto.createdAt = entity.createdAt.toISOString();
    dto.updatedAt = entity.updatedAt.toISOString();
    return dto;
  }
}
