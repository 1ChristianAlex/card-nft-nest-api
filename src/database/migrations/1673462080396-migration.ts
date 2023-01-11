import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1673462080396 implements MigrationInterface {
  name = 'migration1673462080396';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "store"."store" DROP CONSTRAINT "FK_77d32d2e0a0de26415c1faac7b8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."deck" DROP CONSTRAINT "FK_b0d7f3a386b67802d5c09407b34"`,
    );
    await queryRunner.query(`ALTER TABLE "store"."store" DROP COLUMN "deckId"`);
    await queryRunner.query(`ALTER TABLE "card"."deck" DROP COLUMN "storeId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "card"."deck" ADD "storeId" integer`);
    await queryRunner.query(`ALTER TABLE "store"."store" ADD "deckId" integer`);
    await queryRunner.query(
      `ALTER TABLE "card"."deck" ADD CONSTRAINT "FK_b0d7f3a386b67802d5c09407b34" FOREIGN KEY ("storeId") REFERENCES "store"."store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "store"."store" ADD CONSTRAINT "FK_77d32d2e0a0de26415c1faac7b8" FOREIGN KEY ("deckId") REFERENCES "card"."deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
