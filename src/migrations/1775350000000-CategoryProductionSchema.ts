import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Hardens `category` for production: trimmed names, length bounds,
 * case-insensitive uniqueness, supporting indexes, timestamptz.
 * Safe for existing data: normalizes rows first; fails fast if constraints cannot be met.
 */
export class CategoryProductionSchema1775350000000 implements MigrationInterface {
  name = "CategoryProductionSchema1775350000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "category" SET "name" = trim(both from "name") WHERE "name" <> trim(both from "name")`,
    );

    const dupes = (await queryRunner.query(
      `SELECT COUNT(*)::text AS cnt FROM (
         SELECT 1 FROM "category"
         GROUP BY lower(trim(both from "name"))
         HAVING COUNT(*) > 1
       ) AS d`,
    )) as { cnt: string }[];
    if (Number(dupes[0]?.cnt) > 0) {
      throw new Error(
        'Migration aborted: duplicate category names differing only by case or spacing. Resolve duplicates, then re-run.',
      );
    }

    const invalidLen = (await queryRunner.query(
      `SELECT COUNT(*)::text AS cnt FROM "category"
       WHERE char_length(trim(both from "name")) < 2 OR char_length(trim(both from "name")) > 50`,
    )) as { cnt: string }[];
    if (Number(invalidLen[0]?.cnt) > 0) {
      throw new Error(
        'Migration aborted: some category names are shorter than 2 or longer than 50 characters after trim. Fix data, then re-run.',
      );
    }

    await queryRunner.query(
      `ALTER TABLE "category" ALTER COLUMN "name" TYPE character varying(50)`,
    );

    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "UQ_23c05c292c439d77b0de816b500"`,
    );

    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_category_name_ci" ON "category" (LOWER(TRIM(BOTH FROM "name")))`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_category_name" ON "category" ("name")`,
    );

    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "CHK_category_name_trim_length"
       CHECK (
         char_length(trim(both from "name")) >= 2
         AND char_length(trim(both from "name")) <= 50
         AND "name" = trim(both from "name")
       ) NOT VALID`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" VALIDATE CONSTRAINT "CHK_category_name_trim_length"`,
    );

    await queryRunner.query(
      `ALTER TABLE "category" ALTER COLUMN "createdAt" TYPE timestamptz USING "createdAt" AT TIME ZONE 'UTC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ALTER COLUMN "updatedAt" TYPE timestamptz USING "updatedAt" AT TIME ZONE 'UTC'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category" ALTER COLUMN "updatedAt" TYPE timestamp USING "updatedAt" AT TIME ZONE 'UTC'`,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ALTER COLUMN "createdAt" TYPE timestamp USING "createdAt" AT TIME ZONE 'UTC'`,
    );

    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT IF EXISTS "CHK_category_name_trim_length"`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_category_name"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_category_name_ci"`);

    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name")`,
    );

    await queryRunner.query(
      `ALTER TABLE "category" ALTER COLUMN "name" TYPE character varying`,
    );
  }
}
