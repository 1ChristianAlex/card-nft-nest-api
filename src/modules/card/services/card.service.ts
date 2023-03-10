import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import DeckService from 'src/modules/deck/services/deck.service';
import { Equal, Not, Repository, MoreThanOrEqual } from 'typeorm';
import CardEntity from '../entities/card.entity';
import { CARD_STATUS_ENUM } from '../entities/cardStatus.entity';
import TierEntity from '../entities/tier.entity';
import CardMessages from './card.messages';
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

  private async findWithRelations(cardUpdate: CardModel): Promise<CardEntity> {
    return this.cardRepository.findOneOrFail({
      where: {
        id: cardUpdate.id,
      },
      relations: {
        tier: true,
        thumbnail: true,
      },
      order: { thumbnail: { position: 'ASC' } },
    });
  }

  public readonly claimTime = 20;

  private async renewCardStatus(cardId: number): Promise<void> {
    const currentTime = new Date();

    currentTime.setSeconds(currentTime.getSeconds() + this.claimTime);

    await this.cardRepository.update(
      {
        id: cardId,
        updatedAt: MoreThanOrEqual(currentTime),
        status: {
          id: Not(Equal(CARD_STATUS_ENUM.CLAIMED)),
        },
      },
      {
        status: {
          id: CARD_STATUS_ENUM.FREE,
        },
      },
    );
  }

  public async registerNewCard(
    cardToCreate: CardModel,
    userId: number,
  ): Promise<CardModel> {
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

    this.cardPriceService.applyTierMultiplier(cardCreated);

    return CardModel.fromEntity(cardCreated);
  }

  public async updateCard(cardUpdate: CardModel): Promise<CardModel> {
    const oldCard = await this.findWithRelations(cardUpdate);

    await this.cardRepository.update(
      { id: cardUpdate.id },
      {
        description: cardUpdate.description || oldCard.description,
        likes: cardUpdate.likes || oldCard.likes,
        name: cardUpdate.name || oldCard.name,
        price: cardUpdate.price || oldCard.price,
        tier: cardUpdate.tier.id
          ? ({ id: cardUpdate.tier.id } as TierEntity)
          : oldCard.tier,
      },
    );

    this.cardPriceService.checkCardTier({
      ...oldCard,
      price: cardUpdate.price || oldCard.price,
    });

    const newCard = await this.findWithRelations(cardUpdate);

    this.cardPriceService.applyTierMultiplier(newCard);

    return CardModel.fromEntity(newCard);
  }

  public async getRandomCard(userId: number): Promise<CardModel> {
    await this.deckService.decreaseGambles(userId);

    const randomId = await this.cardRepository
      .createQueryBuilder('card')
      .select('card.id')
      .where(`card.statusId = ${CARD_STATUS_ENUM.FREE}`)
      .andWhere('card.deckId is NULL')
      .andWhere(
        'card.id in(select "thumbs"."cardId" from card.thumbs "thumbs")',
      )
      .orderBy('RANDOM()')
      .getOneOrFail();

    const [random] = await Promise.all([
      this.cardRepository.findOneOrFail({
        where: {
          id: randomId.id,
        },
        relations: {
          tier: true,
          thumbnail: true,
          status: true,
        },
        order: { thumbnail: { position: 'ASC' } },
      }),

      this.cardRepository.update(
        { id: randomId.id },
        { status: { id: CARD_STATUS_ENUM.IN_GAMBLE } },
      ),
    ]);

    setTimeout(() => this.renewCardStatus(random.id), this.claimTime * 1000);

    this.cardPriceService.applyTierMultiplier(random);

    return CardModel.fromEntity(random);
  }

  async discardCard(cardId: number, userId: number): Promise<void> {
    const cardToDiscard = await this.cardRepository
      .findOneOrFail({
        where: { id: cardId },
        relations: { deck: { user: true }, tier: true },
      })
      .catch(() => {
        throw new Error(CardMessages.WITHOUT_OWNER);
      });

    if (userId !== cardToDiscard.deck.user.id) {
      throw new Error(CardMessages.DIFF_OWNER);
    }

    await Promise.all([
      this.cardRepository.update(
        { id: cardId },
        { deck: { id: null }, status: { id: CARD_STATUS_ENUM.FREE } },
      ),
      this.deckService.changeDeckCoins(
        cardToDiscard.deck.id,
        this.cardPriceService.doTierMultiplier(cardToDiscard),
        true,
      ),
    ]);
  }
  async listDeckCards(deckId: number): Promise<CardModel[]> {
    const list = await this.cardRepository.find({
      where: { deck: { id: deckId } },
      relations: {
        tier: true,
        thumbnail: true,
        status: true,
      },
      order: { thumbnail: { position: 'ASC' } },
    });

    return list.map(CardModel.fromEntity);
  }
}

export default CardService;
