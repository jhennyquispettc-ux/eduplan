import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity.js';

@Entity('categories')
@Index('UQ_categories_name_active', ['name'], {
  unique: true,
  where: '"deleted_at" IS NULL',
})
export class Category extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string | null;
}
