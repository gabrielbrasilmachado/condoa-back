import { MigrationInterface, QueryRunner } from 'typeorm'

export class EnableRlsOnMigrationsTable20260401123000 implements MigrationInterface {
  name = 'EnableRlsOnMigrationsTable20260401123000'

  private readonly tableName = 'migrations'

  private readonly policyName = 'deny_direct_access_on_migrations'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "${this.tableName}" ENABLE ROW LEVEL SECURITY
    `)

    await queryRunner.query(`
      CREATE POLICY "${this.policyName}"
      ON "${this.tableName}"
      FOR ALL
      TO PUBLIC
      USING (false)
      WITH CHECK (false)
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP POLICY IF EXISTS "${this.policyName}" ON "${this.tableName}"
    `)

    await queryRunner.query(`
      ALTER TABLE "${this.tableName}" DISABLE ROW LEVEL SECURITY
    `)
  }
}
