import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateCondominiumRequests20260325103000 implements MigrationInterface {
  name = 'CreateCondominiumRequests20260325103000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "condominium_request_status" AS ENUM ('pending', 'approved', 'rejected')
    `)

    await queryRunner.query(`
      CREATE TABLE "condominium_requests" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "condominium_id" uuid NOT NULL,
        "status" "condominium_request_status" NOT NULL DEFAULT 'pending',
        "rejection_reason" text NULL,
        "reviewed_at" timestamp NULL,
        "reviewed_by_user_id" uuid NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_condominium_requests_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_condominium_requests_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_condominium_requests_condominium_id" FOREIGN KEY ("condominium_id") REFERENCES "condominiums"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_condominium_requests_reviewed_by_user_id" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION
      )
    `)

    await queryRunner.query(`
      CREATE INDEX "IDX_condominium_requests_status" ON "condominium_requests" ("status")
    `)
    await queryRunner.query(`
      CREATE INDEX "IDX_condominium_requests_user_id" ON "condominium_requests" ("user_id")
    `)
    await queryRunner.query(`
      CREATE INDEX "IDX_condominium_requests_condominium_id" ON "condominium_requests" ("condominium_id")
    `)
    await queryRunner.query(`
      CREATE INDEX "IDX_condominium_requests_reviewed_by_user_id" ON "condominium_requests" ("reviewed_by_user_id")
    `)
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_condominium_requests_pending_per_user" ON "condominium_requests" ("user_id") WHERE "status" = 'pending'
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."UQ_condominium_requests_pending_per_user"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_condominium_requests_reviewed_by_user_id"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_condominium_requests_condominium_id"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_condominium_requests_user_id"`
    )
    await queryRunner.query(
      `DROP INDEX "public"."IDX_condominium_requests_status"`
    )
    await queryRunner.query(`DROP TABLE "condominium_requests"`)
    await queryRunner.query(`DROP TYPE "condominium_request_status"`)
  }
}
