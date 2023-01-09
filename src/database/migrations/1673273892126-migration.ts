import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1673273892126 implements MigrationInterface {
  name = 'migration1673273892126';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "card"."deck" ALTER COLUMN "nextDaily" SET DEFAULT '"2023-01-10T14:18:14.338Z"'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "card"."deck" ALTER COLUMN "nextDaily" SET DEFAULT '2023-01-10 14:17:52.745'`,
    );
  }
}
