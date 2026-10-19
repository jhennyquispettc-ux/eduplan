import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCoursesModulesAndLessons1792377763810 implements MigrationInterface {
  name = 'CreateCoursesModulesAndLessons1792377763810';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."course_status" AS ENUM('DRAFT', 'PUBLISHED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "courses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "title" character varying(150) NOT NULL, "description" text NOT NULL, "cover_image_url" character varying(500), "estimated_hours" smallint, "status" "public"."course_status" NOT NULL DEFAULT 'DRAFT', "category_id" uuid NOT NULL, CONSTRAINT "PK_3f70a487cc718ad8eda4e6d58c9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_courses_category_id" ON "courses"  ("category_id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_courses_title_active" ON "courses"  ("title") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."lesson_type" AS ENUM('TEXT', 'VIDEO')`,
    );
    await queryRunner.query(
      `CREATE TABLE "lessons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "title" character varying(150) NOT NULL, "type" "public"."lesson_type" NOT NULL, "content" text, "video_url" character varying(500), "module_id" uuid NOT NULL, CONSTRAINT "CHK_lessons_content_by_type" CHECK (("type" = 'TEXT' AND "content" IS NOT NULL AND "video_url" IS NULL) OR ("type" = 'VIDEO' AND "video_url" IS NOT NULL)), CONSTRAINT "PK_9b9a8d455cac672d262d7275730" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_lessons_module_id" ON "lessons"  ("module_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "course_modules" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "title" character varying(150) NOT NULL, "description" character varying(1000), "course_id" uuid NOT NULL, CONSTRAINT "PK_4c195db0718e8845a6e09075ebc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_course_modules_course_id" ON "course_modules"  ("course_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" ADD CONSTRAINT "FK_e4c260fe6bb1131707c4617f745" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "lessons" ADD CONSTRAINT "FK_35fb2307535d90a6ed290af1f4a" FOREIGN KEY ("module_id") REFERENCES "course_modules"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_modules" ADD CONSTRAINT "FK_81644557c2401f37fe9e884e884" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "course_modules" DROP CONSTRAINT "FK_81644557c2401f37fe9e884e884"`,
    );
    await queryRunner.query(
      `ALTER TABLE "lessons" DROP CONSTRAINT "FK_35fb2307535d90a6ed290af1f4a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "courses" DROP CONSTRAINT "FK_e4c260fe6bb1131707c4617f745"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_course_modules_course_id"`,
    );
    await queryRunner.query(`DROP TABLE "course_modules"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_lessons_module_id"`);
    await queryRunner.query(`DROP TABLE "lessons"`);
    await queryRunner.query(`DROP TYPE "public"."lesson_type"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_courses_title_active"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_courses_category_id"`);
    await queryRunner.query(`DROP TABLE "courses"`);
    await queryRunner.query(`DROP TYPE "public"."course_status"`);
  }
}
