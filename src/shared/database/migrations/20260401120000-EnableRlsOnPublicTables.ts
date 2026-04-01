import { MigrationInterface, QueryRunner } from 'typeorm'

export class EnableRlsOnPublicTables20260401120000 implements MigrationInterface {
  name = 'EnableRlsOnPublicTables20260401120000'

  private readonly tables = [
    'users',
    'refresh_tokens',
    'condominiums',
    'addresses',
    'categories',
    'items',
    'item_images',
    'condominium_requests',
  ]

  private buildPolicyName(tableName: string): string {
    return `deny_direct_access_on_${tableName}`
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const tableName of this.tables) {
      const policyName = this.buildPolicyName(tableName)

      await queryRunner.query(`
        ALTER TABLE "${tableName}" ENABLE ROW LEVEL SECURITY
      `)

      await queryRunner.query(`
        CREATE POLICY "${policyName}"
        ON "${tableName}"
        FOR ALL
        TO PUBLIC
        USING (false)
        WITH CHECK (false)
      `)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const tableName of [...this.tables].reverse()) {
      const policyName = this.buildPolicyName(tableName)

      await queryRunner.query(`
        DROP POLICY IF EXISTS "${policyName}" ON "${tableName}"
      `)

      await queryRunner.query(`
        ALTER TABLE "${tableName}" DISABLE ROW LEVEL SECURITY
      `)
    }
  }
}
