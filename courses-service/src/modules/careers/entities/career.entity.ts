import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity.js';

@Entity('careers')
@Index('UQ_careers_name_active', ['name'], {
  unique: true,
  where: '"deleted_at" IS NULL',
})
export class Career extends BaseEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  description: string | null;
}
