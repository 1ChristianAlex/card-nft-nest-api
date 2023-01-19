import { MigrationInterface, QueryRunner } from 'typeorm';
import { readFile } from 'fs/promises';
import { join, resolve } from 'path';
import CardEntity from '../../modules/card/entities/card.entity';
import ThumbsEntity from '../../modules/card/entities/thumbs.entity';
import { CARD_TIER } from '../../modules/card/services/card.model';
import TierEntity from '../../modules/card/entities/tier.entity';
import { CARD_STATUS_ENUM } from '../../modules/card/entities/cardStatus.entity';

export class CardsSeeds2674139163434 implements MigrationInterface {
  private readFile = async (): Promise<
    {
      name: string;
      description: string;
      likes: number;
      rank: number;
      thumbnails: string[];
    }[]
  > => {
    const filePath = resolve(
      join(process.cwd(), 'src', 'database', 'anime-characters.json'),
    );

    const fileReaded = await readFile(filePath).then((result) =>
      result.toString(),
    );

    return JSON.parse(fileReaded) as {
      name: string;
      description: string;
      likes: number;
      rank: number;
      thumbnails: string[];
    }[];
  };

  public async up(queryRunner: QueryRunner): Promise<void> {
    const cardsList = await this.readFile();
    await Promise.all(
      cardsList.map(async (item) => {
        const name = item.name
          .split(',')
          .reverse()
          .join()
          .replace(',', ' ')
          .trim();
        const cardInsert = await queryRunner.manager.save(
          CardEntity,
          new CardEntity({
            description: item.description,
            likes: item.likes,
            name,
            price: 150,
            tier: { id: CARD_TIER.SILVER } as TierEntity,
            user: { id: 1 },
            status: { id: CARD_STATUS_ENUM.FREE },
            deck: null,
          }),
        );

        await queryRunner.manager.insert(
          ThumbsEntity,
          item.thumbnails.map(
            (itemThumb, index) =>
              new ThumbsEntity({
                card: { id: cardInsert.id },
                description: `Thumb ${name}`,
                path: itemThumb,
                position: index,
              }),
          ),
        );
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const cardsList = await this.readFile();

    await Promise.all(
      cardsList.map(async (item) => {
        await queryRunner.manager.delete(
          ThumbsEntity,
          item.thumbnails.map((itemThumb) => ({ path: itemThumb })),
        );

        await queryRunner.manager.delete(CardEntity, {
          name: item.name,
        });
      }),
    );
  }
}
