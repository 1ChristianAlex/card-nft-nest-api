import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1672464188638 implements MigrationInterface {
  name = 'migration1672464188638';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "card"."wallet" DROP CONSTRAINT "FK_5b0d1be5123fd3d17897e813089"`,
    );
    await queryRunner.query(`ALTER TABLE "card"."wallet" DROP COLUMN "cardId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "card"."wallet" ADD "cardId" integer`);
    await queryRunner.query(
      `ALTER TABLE "card"."wallet" ADD CONSTRAINT "FK_5b0d1be5123fd3d17897e813089" FOREIGN KEY ("cardId") REFERENCES "card"."card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
