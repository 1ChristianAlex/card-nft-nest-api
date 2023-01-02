import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import DeckService from 'src/modules/deck/services/deck.service';
import { Repository } from 'typeorm';
import CardEntity from '../entities/card.entity';
import { CARD_STATUS_ENUM } from '../entities/cardStatus.entity';
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
    private deckService: DeckService,
  ) {}

  public async registerNewCard(cardToCreate: CardModel, userId: number) {
    const [lowestTier] = await this.tierRepository.find({
      order: { value: 'ASC' },
      take: 1,
    });

    const cardEntity = new CardEntity({
      name: cardToCreate.name,
      description: cardToCreate.description,
      price: cardToCreate.price,
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
    await this.deckService.decreaseGambles(userId);

    const randomId = await this.cardRepository
      .createQueryBuilder('card')
      .select('card.id')
      // .innerJoinAndSelect(TierEntity, 'tier', 'card.tierId = tier.id')
      // .innerJoinAndSelect(ThumbsEntity, 'thumb', 'card.id = thumb.cardId')
      .where(`card.statusId = ${CARD_STATUS_ENUM.FREE}`)
      .andWhere('card.walletId is NULL')
      .orderBy('RANDOM()')
      .getOneOrFail();

    const [random] = await this.cardRepository.find({
      where: {
        id: randomId.id,
      },
      relations: {
        tier: true,
        thumbnail: true,
        status: true,
      },
    });

    random.status.id = CARD_STATUS_ENUM.IN_GAMBLE;

    await this.cardRepository.update(
      { id: random.id },
      { status: random.status },
    );

    setTimeout(() => this.renewCardStatus(random.id), 5000);

    return this.cardPriceService.applyTierMultiplayer(random);
  }

  private async renewCardStatus(cardId: number) {
    const [cardItem] = await this.cardRepository.find({
      where: {
        id: cardId,
      },
      relations: {
        status: true,
      },
    });

    if (cardItem.status.id !== CARD_STATUS_ENUM.CLAIMED) {
      await this.cardRepository.update(
        { id: cardItem.id },
        {
          status: {
            id: CARD_STATUS_ENUM.FREE,
          },
        },
      );
    }
  }
}

export default CardService;
