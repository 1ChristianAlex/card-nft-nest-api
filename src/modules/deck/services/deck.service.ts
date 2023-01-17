import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import CardMessages from 'src/modules/card/services/card.messages';
import { Repository, Not, IsNull } from 'typeorm';
import CardEntity from '../../card/entities/card.entity';
import { CARD_STATUS_ENUM } from '../../card/entities/cardStatus.entity';
import DeckEntity from '../entities/deck.entity';
import DeckMessages from './deck.messages';
import { DeckModel } from './deck.model';

@Injectable()
class DeckService {
  constructor(
    @InjectRepository(DeckEntity)
    private deckRepository: Repository<DeckEntity>,
    @InjectRepository(CardEntity)
    private cardRepository: Repository<CardEntity>,
  ) {}

  async decreaseGambles(userId: number): Promise<void> {
    const userDeck = await this.deckRepository.findOneByOrFail({
      user: { id: userId },
    });

    if (!userDeck.gambles) {
      throw new Error(DeckMessages.WITHOUT_GAMBLES);
    }

    await this.deckRepository.decrement({ user: { id: userId } }, 'gambles', 1);
  }

  async getUserDeck(userId: number): Promise<DeckEntity> {
    const userDeck = await this.deckRepository.findOneOrFail({
      where: { user: { id: userId } },
      relations: {
        user: true,
      },
    });

    return userDeck;
  }

  async getDeckById(id: number): Promise<DeckEntity> {
    const deck = await this.deckRepository.findOneOrFail({
      where: { id },
      relations: {
        user: true,
      },
    });

    return deck;
  }

  async refreshClaimdedTotal(userDeck: DeckModel): Promise<void> {
    await Promise.all([
      this.deckRepository.increment({ id: userDeck.id }, 'deckAmount', 1),
      this.deckRepository.decrement({ id: userDeck.id }, 'claims', 1),
    ]);
  }

  public async claimCard(cardId: number, userId: number): Promise<void> {
    const userDeck = await this.getUserDeck(userId);

    if (!userDeck.claims) {
      throw new Error(DeckMessages.CANT_CLAIM);
    }

    const cardToBeClaimed = await this.cardRepository
      .findOneOrFail({
        where: {
          id: cardId,
          status: {
            id: CARD_STATUS_ENUM.IN_GAMBLE,
          },
        },
        relations: { status: true },
      })
      .catch(() => {
        throw new Error(CardMessages.NOT_IN_GAMBLE);
      });

    await this.cardRepository.update(
      { id: cardToBeClaimed.id },
      {
        status: {
          id: CARD_STATUS_ENUM.CLAIMED,
        },
        deck: { id: userDeck.id },
      },
    );

    await this.refreshClaimdedTotal(userDeck);
  }

  public async refreshAllGumbles(): Promise<void> {
    const nextGamble = this.getNextGamble();

    await this.deckRepository.update(
      { id: Not(IsNull()) },
      { gambles: 8, nextGamble },
    );
  }

  private getNextGamble(): Date {
    const nextGamble = new Date();

    nextGamble.setHours(nextGamble.getHours() + 1);
    return nextGamble;
  }

  public async invokeDailyReset(userId: number): Promise<void> {
    const userDeck = await this.deckRepository.findOneByOrFail({
      user: { id: userId },
    });

    if (userDeck.nextDaily && Date.now() < userDeck.nextDaily.getTime()) {
      throw new Error(DeckMessages.CANT_INVOKE_DAILY_GAMBLE_RESET);
    }

    const nextDaily = this.dateAddDay();

    await this.deckRepository.update(
      { id: userDeck.id },
      {
        gambles: 8,
        nextDaily,
      },
    );
  }

  public async invokeDailyCoins(userId: number): Promise<number> {
    const userDeck = await this.deckRepository.findOneByOrFail({
      user: { id: userId },
    });

    if (
      userDeck.nextDailyCoins &&
      Date.now() < userDeck.nextDailyCoins.getTime()
    ) {
      throw new Error(DeckMessages.CANT_INVOKE_DAILY_COINS);
    }

    let coindAdded = 230;

    if (userDeck.nextDailyCoins) {
      const lastInvoked = new Date(userDeck.nextDailyCoins);
      const yesterday = new Date();

      lastInvoked.setHours(lastInvoked.getHours() - 24);
      yesterday.setHours(lastInvoked.getHours() - 24);

      if (lastInvoked.getDate() === yesterday.getDate()) {
        coindAdded = coindAdded + 100;
      }
    }

    const nextDailyCoins = this.dateAddDay();

    await this.deckRepository.update(
      { id: userDeck.id },
      {
        coins: coindAdded,
        nextDailyCoins,
      },
    );

    return coindAdded;
  }

  private dateAddDay(): Date {
    const nextDaily = new Date();

    nextDaily.setHours(nextDaily.getHours() + 24);
    return nextDaily;
  }

  async changeDeckCoins(
    deckId: number,
    value: number,
    isIncresing = true,
  ): Promise<void> {
    if (isIncresing) {
      await this.deckRepository.increment({ id: deckId }, 'coins', value);
    } else {
      const currentDeck = await this.deckRepository.findOne({
        where: { id: deckId },
      });

      let valueToDecrement = value;

      if (currentDeck.coins < value) {
        valueToDecrement = value + value * 0.25;
      }

      await this.deckRepository.decrement(
        { id: deckId },
        'coins',
        valueToDecrement,
      );
    }
  }

  async newDeck(userId: number): Promise<void> {
    await this.deckRepository.insert(new DeckEntity({ user: { id: userId } }));
  }
}

export default DeckService;
