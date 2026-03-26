import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitialMigration20260320160000 implements MigrationInterface {
  name = 'InitialMigration20260320160000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'user_role'
        ) THEN
          CREATE TYPE "public"."user_role" AS ENUM('admin', 'user');
        END IF;
      END
      $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'user_status'
        ) THEN
          CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive');
        END IF;
      END
      $$;
    `)

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_type WHERE typname = 'item_status'
        ) THEN
          CREATE TYPE "public"."item_status" AS ENUM('available', 'donated', 'expired');
        END IF;
      END
      $$;
    `)

    await queryRunner.query(`
      CREATE TABLE "condominiums" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar(255) NOT NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_condominiums_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_condominiums_name" UNIQUE ("name")
      )
    `)

    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar(255) NOT NULL,
        CONSTRAINT "PK_categories_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_categories_name" UNIQUE ("name")
      )
    `)

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar(255) NOT NULL,
        "email" varchar(255) NOT NULL,
        "phone" varchar(20) NOT NULL,
        "password" varchar(255) NOT NULL,
        "role" "public"."user_role" NOT NULL DEFAULT 'user',
        "status" "public"."user_status" NOT NULL DEFAULT 'active',
        "condominium_id" uuid NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "FK_users_condominium_id" FOREIGN KEY ("condominium_id") REFERENCES "condominiums"("id") ON DELETE SET NULL ON UPDATE NO ACTION
      )
    `)

    await queryRunner.query(`
      CREATE TABLE "addresses" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "zip_code" varchar(20) NOT NULL,
        "name" varchar(255) NOT NULL,
        "number" varchar(20) NOT NULL,
        "district" varchar(255) NOT NULL,
        "city" varchar(255) NOT NULL,
        "state" varchar(2) NOT NULL,
        "complement" varchar(255) NULL,
        "condominium_id" uuid NOT NULL,
        CONSTRAINT "PK_addresses_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_addresses_condominium_id" FOREIGN KEY ("condominium_id") REFERENCES "condominiums"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `)

    await queryRunner.query(`
      CREATE UNIQUE INDEX "uq_addresses_condominium"
      ON "addresses" ("condominium_id")
    `)

    await queryRunner.query(`
      CREATE TABLE "items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar(255) NOT NULL,
        "description" text NOT NULL,
        "status" "public"."item_status" NOT NULL DEFAULT 'available',
        "expired_at" timestamp NULL,
        "category_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "created_at" timestamp NOT NULL DEFAULT now(),
        "updated_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_items_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_items_category_id" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "FK_items_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `)

    await queryRunner.query(`
      CREATE TABLE "item_images" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "item_id" uuid NOT NULL,
        "provider" varchar(50) NOT NULL,
        "bucket" varchar(255) NOT NULL,
        "key" varchar(500) NOT NULL,
        "url" text NOT NULL,
        "mime_type" varchar(255) NOT NULL,
        "size" integer NOT NULL,
        "original_name" varchar(255) NOT NULL,
        "is_primary" boolean NOT NULL DEFAULT false,
        "created_at" timestamp NOT NULL DEFAULT now(),
        CONSTRAINT "PK_item_images_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_item_images_item_id" FOREIGN KEY ("item_id") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `)

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_item_images_primary_per_item"
      ON "item_images" ("item_id")
      WHERE "is_primary" = true
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."UQ_item_images_primary_per_item"`
    )
    await queryRunner.query(`DROP TABLE "item_images"`)
    await queryRunner.query(`DROP TABLE "items"`)
    await queryRunner.query(`DROP INDEX "public"."uq_addresses_condominium"`)
    await queryRunner.query(`DROP TABLE "addresses"`)
    await queryRunner.query(`DROP TABLE "users"`)
    await queryRunner.query(`DROP TABLE "categories"`)
    await queryRunner.query(`DROP TABLE "condominiums"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."item_status"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."user_status"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."user_role"`)
  }
}
