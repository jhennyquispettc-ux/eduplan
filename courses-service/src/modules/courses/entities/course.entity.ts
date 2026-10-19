import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  type Relation,
} from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity.js';
import { Category } from '../../categories/entities/category.entity.js';
import { CourseModuleEntity } from '../../course-modules/entities/course-module.entity.js';
import { CourseStatus } from '../enums/course-status.enum.js';

@Entity('courses')
@Index('UQ_courses_title_active', ['title'], {
  unique: true,
  where: '"deleted_at" IS NULL',
})
@Index('IDX_courses_category_id', ['categoryId'])
export class Course extends BaseEntity {
  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    name: 'cover_image_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  coverImageUrl: string | null;

  @Column({ name: 'estimated_hours', type: 'smallint', nullable: true })
  estimatedHours: number | null;

  @Column({
    type: 'enum',
    enum: CourseStatus,
    enumName: 'course_status',
    default: CourseStatus.DRAFT,
  })
  status: CourseStatus;

  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => Category, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: Relation<Category>;

  @OneToMany(() => CourseModuleEntity, (module) => module.course, {
    cascade: ['soft-remove'],
  })
  modules: Relation<CourseModuleEntity[]>;
}
