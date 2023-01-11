import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1673470450841 implements MigrationInterface {
  name = 'migration1673470450841';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "card"."thumbs" ("id" SERIAL NOT NULL, "description" text NOT NULL, "path" text NOT NULL, "position" integer NOT NULL DEFAULT '1', "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "cardId" integer, CONSTRAINT "PK_feb3b41407cf8c617df146d01e5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "card"."tiers" ("id" SERIAL NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "value" integer NOT NULL, "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_908405492b9b2c2ae1cea1e1cc0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user"."roles" ("id" SERIAL NOT NULL, "description" text NOT NULL, "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "card"."deck" ("id" SERIAL NOT NULL, "coins" integer NOT NULL DEFAULT '0', "deckAmount" integer NOT NULL DEFAULT '0', "claims" integer NOT NULL DEFAULT '1', "gambles" integer NOT NULL DEFAULT '8', "nextGamble" TIMESTAMP, "nextDaily" TIMESTAMP, "nextDailyCoins" TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_99f8010303acab0edf8e1df24f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user"."user" ("id" SERIAL NOT NULL, "name" text NOT NULL, "lastName" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "updatedDate" TIMESTAMP NOT NULL DEFAULT now(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "roleId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "card"."status" ("id" SERIAL NOT NULL, "name" text NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "card"."card" ("id" SERIAL NOT NULL, "name" text NOT NULL, "description" text NOT NULL, "price" integer NOT NULL DEFAULT '30', "likes" integer NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "tierId" integer, "statusId" integer, "userId" integer, "deckId" integer, CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "card"."transaction" ("id" SERIAL NOT NULL, "coins" integer NOT NULL DEFAULT '0', "type" text NOT NULL, "status" text NOT NULL DEFAULT 'REQUEST', "transactedAt" TIMESTAMP NOT NULL DEFAULT now(), "deckId" integer, "userId" integer, "transactionId" integer, CONSTRAINT "REL_bdcf2c929b61c0935576652d9b" UNIQUE ("transactionId"), CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "store"."store" ("id" SERIAL NOT NULL, "price" integer NOT NULL DEFAULT '0', "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "cardId" integer, "transactionId" integer, CONSTRAINT "PK_f3172007d4de5ae8e7692759d79" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "card"."transaction_cards_card" ("transactionId" integer NOT NULL, "cardId" integer NOT NULL, CONSTRAINT "PK_edbc84f28404140eed987cd5a51" PRIMARY KEY ("transactionId", "cardId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2041c8bc9dcf8e1e0148610d25" ON "card"."transaction_cards_card" ("transactionId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_10132a7659a744ff964977a489" ON "card"."transaction_cards_card" ("cardId") `,
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
      `ALTER TABLE "card"."card" ADD CONSTRAINT "FK_673081effbabe22d74757339c60" FOREIGN KEY ("deckId") REFERENCES "card"."deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."transaction" ADD CONSTRAINT "FK_9ccb35d6db3b4c5197e10dfd77c" FOREIGN KEY ("deckId") REFERENCES "card"."deck"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."transaction" ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "user"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."transaction" ADD CONSTRAINT "FK_bdcf2c929b61c0935576652d9b0" FOREIGN KEY ("transactionId") REFERENCES "card"."transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "store"."store" ADD CONSTRAINT "FK_3f82dbf41ae837b8aa0a27d29c3" FOREIGN KEY ("userId") REFERENCES "user"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "store"."store" ADD CONSTRAINT "FK_d82122b168b8228a76f91db67de" FOREIGN KEY ("cardId") REFERENCES "card"."card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "store"."store" ADD CONSTRAINT "FK_87ebc50c68badd7b800f7014f17" FOREIGN KEY ("transactionId") REFERENCES "card"."transaction"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."transaction_cards_card" ADD CONSTRAINT "FK_2041c8bc9dcf8e1e0148610d257" FOREIGN KEY ("transactionId") REFERENCES "card"."transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."transaction_cards_card" ADD CONSTRAINT "FK_10132a7659a744ff964977a4896" FOREIGN KEY ("cardId") REFERENCES "card"."card"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "card"."transaction_cards_card" DROP CONSTRAINT "FK_10132a7659a744ff964977a4896"`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."transaction_cards_card" DROP CONSTRAINT "FK_2041c8bc9dcf8e1e0148610d257"`,
    );
    await queryRunner.query(
      `ALTER TABLE "store"."store" DROP CONSTRAINT "FK_87ebc50c68badd7b800f7014f17"`,
    );
    await queryRunner.query(
      `ALTER TABLE "store"."store" DROP CONSTRAINT "FK_d82122b168b8228a76f91db67de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "store"."store" DROP CONSTRAINT "FK_3f82dbf41ae837b8aa0a27d29c3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."transaction" DROP CONSTRAINT "FK_bdcf2c929b61c0935576652d9b0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."transaction" DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."transaction" DROP CONSTRAINT "FK_9ccb35d6db3b4c5197e10dfd77c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "card"."card" DROP CONSTRAINT "FK_673081effbabe22d74757339c60"`,
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
    await queryRunner.query(
      `DROP INDEX "card"."IDX_10132a7659a744ff964977a489"`,
    );
    await queryRunner.query(
      `DROP INDEX "card"."IDX_2041c8bc9dcf8e1e0148610d25"`,
    );
    await queryRunner.query(`DROP TABLE "card"."transaction_cards_card"`);
    await queryRunner.query(`DROP TABLE "store"."store"`);
    await queryRunner.query(`DROP TABLE "card"."transaction"`);
    await queryRunner.query(`DROP TABLE "card"."card"`);
    await queryRunner.query(`DROP TABLE "card"."status"`);
    await queryRunner.query(`DROP TABLE "user"."user"`);
    await queryRunner.query(`DROP TABLE "card"."deck"`);
    await queryRunner.query(`DROP TABLE "user"."roles"`);
    await queryRunner.query(`DROP TABLE "card"."tiers"`);
    await queryRunner.query(`DROP TABLE "card"."thumbs"`);
  }
}
