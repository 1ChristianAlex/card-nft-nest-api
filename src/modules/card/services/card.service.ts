import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import WalletService from 'src/modules/card/services/wallet.service';
import { Repository } from 'typeorm';
import CardEntity from '../entities/card.entity';
import ThumbsEntity from '../entities/thumbs.entity';
import TierEntity from '../entities/tier.entity';
import { CardModel } from './card.model';
import CardPriceService from './cardPrice.service';

@Injectable()
class CardService {
  constructor(
    @InjectRepository(CardEntity)
    private cardRepository: Repository<CardEntity>,
    @InjectRepository(TierEntity)
    private tierRepository: Repository<TierEntity>,
    private cardPriceService: CardPriceService,
    private walletService: WalletService,
  ) {}

  public async registerNewCard(cardToCreate: CardModel, userId: number) {
    const [lowestTier] = await this.tierRepository.find({
      order: { value: 'ASC' },
      take: 1,
    });

    const cardEntity = new CardEntity({
      name: cardToCreate.name,
      description: cardToCreate.description,
      price: cardToCreate.price + lowestTier.value,
      likes: cardToCreate.likes ?? 0,
      tier: lowestTier,
      thumbnail: null,
      user: { id: userId },
      status: { id: 1 },
    });

    const cardCreated = await this.cardRepository.save(cardEntity);

    return this.cardPriceService.applyTierMultiplayer(cardCreated);
  }

  public async updateCard(cardUpdate: CardModel) {
    const [oldCard] = await this.findWithRelations(cardUpdate);

    const cartEntityToUpdate = new CardEntity({
      description: cardUpdate.description || oldCard.description,
      likes: cardUpdate.likes || oldCard.likes,
      name: cardUpdate.name || oldCard.name,
      price: cardUpdate.price || oldCard.price,
      thumbnail: oldCard.thumbnail,
      tier: cardUpdate.tier.id
        ? ({ id: cardUpdate.tier.id } as TierEntity)
        : oldCard.tier,
      id: oldCard.id,
    });

    if (Array.isArray(cardUpdate.thumbnail)) {
      cartEntityToUpdate.thumbnail = [
        ...oldCard.thumbnail,
        ...cardUpdate.thumbnail?.map(
          (item) => ({ id: item.id } as ThumbsEntity),
        ),
      ];
    }

    const afterUpdate = await this.cardRepository.save(cartEntityToUpdate);

    return this.cardPriceService.applyTierMultiplayer(afterUpdate);
  }

  private async findWithRelations(
    cardUpdate: CardModel,
  ): Promise<CardEntity[]> {
    return this.cardRepository.find({
      where: {
        id: cardUpdate.id,
      },
      relations: {
        tier: true,
        thumbnail: true,
      },
    });
  }

  public async getRandomCard(userId: number) {
    const randomId = await this.cardRepository
      .createQueryBuilder('card')
      // .innerJoinAndSelect(TierEntity, 'tier', 'card.tierId = tier.id')
      // .innerJoinAndSelect(ThumbsEntity, 'thumb', 'card.id = thumb.cardId')
      // .relation(ThumbsEntity, 'thumbs')
      .where('card.walletId is NULL')
      .orderBy('RANDOM()')
      .getOneOrFail();

    const [random] = await this.cardRepository.find({
      where: {
        id: randomId.id,
      },
      relations: {
        tier: true,
        thumbnail: true,
      },
    });

    await this.walletService.decreaseGambles(userId);

    return this.cardPriceService.applyTierMultiplayer(random);
  }
}

export default CardService;
