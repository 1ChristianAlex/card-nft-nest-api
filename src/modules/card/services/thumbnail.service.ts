import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CommonMessages from 'src/modules/common/common.messages';
import { Repository, MoreThanOrEqual, In } from 'typeorm';
import ThumbsEntity from '../entities/thumbs.entity';

@Injectable()
class ThumbnailService {
  constructor(
    @InjectRepository(ThumbsEntity)
    private thumbRepository: Repository<ThumbsEntity>,
  ) {}

  async registerImage(
    imagePath: string,
    cardId: number,
    description: string,
  ): Promise<void> {
    await this.thumbRepository.insert(
      new ThumbsEntity({
        card: { id: cardId },
        description,
        path: imagePath,
        position: 1,
      }),
    );
  }

  async changePosition(thumbId: number, newPosition: number): Promise<void> {
    const exist = await this.thumbRepository
      .findOneByOrFail({ id: thumbId })
      .catch(() => {
        throw new Error(CommonMessages.NOT_FOUND);
      });

    if (exist) {
      const hasPosition = await this.thumbRepository.findOneBy({
        position: newPosition,
      });

      if (hasPosition) {
        const greaterThanPositionList = await this.thumbRepository.findBy({
          position: MoreThanOrEqual(newPosition),
        });

        await this.thumbRepository.increment(
          {
            id: In(greaterThanPositionList.map((item) => item.id)),
          },
          'position',
          1,
        );
      }

      await this.thumbRepository.update(
        {
          id: thumbId,
        },
        { position: newPosition },
      );
    }
  }
}

export default ThumbnailService;
