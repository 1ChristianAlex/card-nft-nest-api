import { MigrationInterface, QueryRunner } from 'typeorm';

export class initialMigration1672245586088 implements MigrationInterface {
  name = 'initialMigration1672245586088';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "card"."thumbs_entity" ("id" SERIAL NOT NULL, "description" text NOT NULL, "path" text NOT NULL, "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "cardId" integer, CONSTRAINT "PK_0b4b246e492b533ed7d9189c531" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "card"."tier_entity" ("id" SERIAL NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fe143d98a8fd7ecb586fed5bb3f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "card"."card_entity" ("id" SERIAL NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "price" integer NOT NULL DEFAULT '30', "likes" integer NOT NULL, "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "tierId" integer, "userId" integer, CONSTRAINT "PK_b9a88963999378ac2b88052a3ce" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user"."wallet_entity" ("id" SERIAL NOT NULL, "value" integer NOT NULL, "deckAmount" integer NOT NULL, "claims" integer NOT NULL DEFAULT '1', "gambles" integer NOT NULL DEFAULT '8', "nextGamble" TIMESTAMP NOT NULL, "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_3e429a1b7a56251b6b8ed06050d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user"."user_entity" ("id" SERIAL NOT NULL, "name" text NOT NULL, "lastName" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "roleId" integer, CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user"."roles_entity" ("id" SERIAL NOT NULL, "description" text NOT NULL, "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d40adf1f0bda238c39fdbf8ab10" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."thumbs_entity" ADD CONSTRAINT "FK_34b0a048808d4eb0e51fac2e431" FOREIGN KEY ("cardId") REFERENCES "card"."card_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."card_entity" ADD CONSTRAINT "FK_8fbe79550de576a72e076c3e46d" FOREIGN KEY ("tierId") REFERENCES "card"."tier_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."card_entity" ADD CONSTRAINT "FK_6806a67cba7534520eacf066622" FOREIGN KEY ("userId") REFERENCES "user"."user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user"."wallet_entity" ADD CONSTRAINT "FK_3f34591d6313fb4a846237b8bf7" FOREIGN KEY ("userId") REFERENCES "user"."user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user"."user_entity" ADD CONSTRAINT "FK_95ab8e7157a5bb4bc0e51aefdd2" FOREIGN KEY ("roleId") REFERENCES "user"."roles_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user"."user_entity" DROP CONSTRAINT "FK_95ab8e7157a5bb4bc0e51aefdd2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user"."wallet_entity" DROP CONSTRAINT "FK_3f34591d6313fb4a846237b8bf7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."card_entity" DROP CONSTRAINT "FK_6806a67cba7534520eacf066622"`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."card_entity" DROP CONSTRAINT "FK_8fbe79550de576a72e076c3e46d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."thumbs_entity" DROP CONSTRAINT "FK_34b0a048808d4eb0e51fac2e431"`,
    );
    await queryRunner.query(`DROP TABLE "user"."roles_entity"`);
    await queryRunner.query(`DROP TABLE "user"."user_entity"`);
    await queryRunner.query(`DROP TABLE "user"."wallet_entity"`);
    await queryRunner.query(`DROP TABLE "card"."card_entity"`);
    await queryRunner.query(`DROP TABLE "card"."tier_entity"`);
    await queryRunner.query(`DROP TABLE "card"."thumbs_entity"`);
  }
}
