import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1673445684032 implements MigrationInterface {
    name = 'migration1673445684032'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card"."thumbs" ADD "position" integer NOT NULL DEFAULT '99'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "card"."thumbs" DROP COLUMN "position"`);
    }

}
