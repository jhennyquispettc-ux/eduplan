import {
  Check,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  type Relation,
} from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity.js';
import { CourseModuleEntity } from '../../course-modules/entities/course-module.entity.js';
import { LessonType } from '../enums/lesson-type.enum.js';

@Entity('lessons')
@Index('IDX_lessons_module_id', ['moduleId'])
@Check(
  'CHK_lessons_content_by_type',
  `("type" = 'TEXT' AND "content" IS NOT NULL AND "video_url" IS NULL) OR ("type" = 'VIDEO' AND "video_url" IS NOT NULL)`,
)
export class Lesson extends BaseEntity {
  @Column({ type: 'varchar', length: 150 })
  title: string;

  @Column({ type: 'enum', enum: LessonType, enumName: 'lesson_type' })
  type: LessonType;

  @Column({ type: 'text', nullable: true })
  content: string | null;

  @Column({ name: 'video_url', type: 'varchar', length: 500, nullable: true })
  videoUrl: string | null;

  @Column({ name: 'module_id', type: 'uuid' })
  moduleId: string;

  @ManyToOne(() => CourseModuleEntity, (module) => module.lessons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'module_id' })
  module: Relation<CourseModuleEntity>;
}
