import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1673273581511 implements MigrationInterface {
  name = 'migration1673273581511';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "card"."thumbs" ("id" SERIAL NOT NULL, "description" text NOT NULL, "path" text NOT NULL, "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "cardId" integer, CONSTRAINT "PK_feb3b41407cf8c617df146d01e5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "card"."tiers" ("id" SERIAL NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "value" integer NOT NULL, "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_908405492b9b2c2ae1cea1e1cc0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user"."roles" ("id" SERIAL NOT NULL, "description" text NOT NULL, "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "card"."deck" ("id" SERIAL NOT NULL, "wallet" integer NOT NULL DEFAULT '0', "deckAmount" integer NOT NULL DEFAULT '0', "claims" integer NOT NULL DEFAULT '1', "gambles" integer NOT NULL DEFAULT '8', "nextGamble" TIMESTAMP NOT NULL, "nextDaily" TIMESTAMP NOT NULL DEFAULT '"2023-01-10T14:13:03.569Z"', "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_99f8010303acab0edf8e1df24f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user"."user" ("id" SERIAL NOT NULL, "name" text NOT NULL, "lastName" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "roleId" integer, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "card"."status" ("id" SERIAL NOT NULL, "name" text NOT NULL, "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "card"."card" ("id" SERIAL NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "price" integer NOT NULL DEFAULT '30', "likes" integer NOT NULL, "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "tierId" integer, "statusId" integer, "userId" integer, "walletId" integer, CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."thumbs" ADD CONSTRAINT "FK_b5ebcfe8592f6fb3b08871a9d1a" FOREIGN KEY ("cardId") REFERENCES "card"."card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."deck" ADD CONSTRAINT "FK_09e8a376bab70b9737c839b2e24" FOREIGN KEY ("userId") REFERENCES "user"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user"."user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "user"."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."card" ADD CONSTRAINT "FK_7b2f76b8d99aa68a45eaa57044c" FOREIGN KEY ("tierId") REFERENCES "card"."tiers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."card" ADD CONSTRAINT "FK_43ac2bbb294b960c7f8ea103949" FOREIGN KEY ("statusId") REFERENCES "card"."status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."card" ADD CONSTRAINT "FK_77d7cc9d95dccd574d71ba221b0" FOREIGN KEY ("userId") REFERENCES "user"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."card" ADD CONSTRAINT "FK_5519368bd6c895ee797c491437d" FOREIGN KEY ("walletId") REFERENCES "card"."deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "card"."card" DROP CONSTRAINT "FK_5519368bd6c895ee797c491437d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."card" DROP CONSTRAINT "FK_77d7cc9d95dccd574d71ba221b0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."card" DROP CONSTRAINT "FK_43ac2bbb294b960c7f8ea103949"`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."card" DROP CONSTRAINT "FK_7b2f76b8d99aa68a45eaa57044c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user"."user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."deck" DROP CONSTRAINT "FK_09e8a376bab70b9737c839b2e24"`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."thumbs" DROP CONSTRAINT "FK_b5ebcfe8592f6fb3b08871a9d1a"`,
    );
    await queryRunner.query(`DROP TABLE "card"."card"`);
    await queryRunner.query(`DROP TABLE "card"."status"`);
    await queryRunner.query(`DROP TABLE "user"."user"`);
    await queryRunner.query(`DROP TABLE "card"."deck"`);
    await queryRunner.query(`DROP TABLE "user"."roles"`);
    await queryRunner.query(`DROP TABLE "card"."tiers"`);
    await queryRunner.query(`DROP TABLE "card"."thumbs"`);
  }
}
