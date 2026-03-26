import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateRefreshTokens20260321103000 implements MigrationInterface {
  name = 'CreateRefreshTokens20260321103000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "refresh_tokens" (
        "id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "token_hash" varchar(255) NOT NULL,
        "expires_at" timestamp NOT NULL,
        "revoked_at" timestamp NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_refresh_tokens_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_refresh_tokens_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "refresh_tokens"`)
  }
}
