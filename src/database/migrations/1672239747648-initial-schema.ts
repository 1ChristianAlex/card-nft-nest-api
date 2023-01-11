import { MigrationInterface, QueryRunner } from 'typeorm';

export class initialSchema1672239747648 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema('user');
    await queryRunner.createSchema('card');
    await queryRunner.createSchema('store');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropSchema('user');
    await queryRunner.dropSchema('card');
    await queryRunner.dropSchema('store');
  }
}
