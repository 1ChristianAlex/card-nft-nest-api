import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull } from 'typeorm';
import CardEntity from '../../card/entities/card.entity';
import { CARD_STATUS_ENUM } from '../../card/entities/cardStatus.entity';
import DeckEntity from '../entities/deck.entity';

@Injectable()
class DeckService {
  constructor(
    @InjectRepository(DeckEntity)
    private deckRepository: Repository<DeckEntity>,
    @InjectRepository(CardEntity)
    private cardRepository: Repository<CardEntity>,
  ) {}

  async decreaseGambles(userId: number) {
    const userWallet = await this.deckRepository.findOneByOrFail({
      user: { id: userId },
    });

    if (!userWallet.gambles) {
      throw new Error('User hasnt gambles.');
    }

    await this.deckRepository.decrement({ user: { id: userId } }, 'gambles', 1);
  }

  async getUserWaller(userId: number) {
    const userDeck = await this.deckRepository.findOneOrFail({
      where: { user: { id: userId } },
      relations: {
        user: true,
      },
    });

    return userDeck;
  }

  async getDeckById(id: number) {
    const deck = await this.deckRepository.findOneOrFail({
      where: { id },
      relations: {
        user: true,
      },
    });

    return deck;
  }

  async refreshClaimdedTotal(userDeck: DeckEntity) {
    const cardsTotal = await this.cardRepository
      .createQueryBuilder('card')
      .where(`card.walletId = ${userDeck.id}`)
      .getCount();

    await this.deckRepository.update(
      { id: userDeck.id },
      { deckAmount: cardsTotal, claims: userDeck.claims - 1 },
    );
  }

  public async claimCard(cardId: number, userId: number) {
    const userWallet = await this.getUserWaller(userId);

    if (!userWallet.claims) {
      throw new Error('User can not claim right now');
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
        throw new Error('Card is not in gamble any more');
      });

    await this.cardRepository.update(
      { id: cardToBeClaimed.id },
      {
        status: {
          id: CARD_STATUS_ENUM.CLAIMED,
        },
        deck: { id: userWallet.id },
      },
    );

    await this.refreshClaimdedTotal(userWallet);
  }

  public async refreshAllGumbles() {
    const nextGamble = this.getNextGamble();

    await this.deckRepository.update(
      { id: Not(IsNull()) },
      { gambles: 8, nextGamble },
    );
  }

  private getNextGamble() {
    const nextGamble = new Date();

    nextGamble.setHours(nextGamble.getHours() + 1);
    return nextGamble;
  }

  public async invokeDailyReset(userId: number) {
    const userDeck = await this.deckRepository.findOneByOrFail({
      user: { id: userId },
    });

    if (Date.now() < userDeck.nextDaily.getTime()) {
      throw new Error('Daily canot be invoked');
    }

    const nextDaily = new Date();

    nextDaily.setHours(nextDaily.getHours() + 24);

    await this.deckRepository.update(
      { id: userDeck.id },
      {
        gambles: 8,
        nextDaily,
        nextGamble: this.getNextGamble(),
      },
    );
  }

  async changeDeckWallet(deckId: number, value: number, isIncresing = true) {
    if (isIncresing) {
      await this.deckRepository.increment({ id: deckId }, 'wallet', value);
    } else {
      const currentDeck = await this.deckRepository.findOne({
        where: { id: deckId },
      });

      let valueToDecrement = value;

      if (currentDeck.wallet < value) {
        valueToDecrement = value + value * 0.25;
      }

      await this.deckRepository.decrement(
        { id: deckId },
        'wallet',
        valueToDecrement,
      );
    }
  }

  async newDeck(userId: number) {
    await this.deckRepository.insert(new DeckEntity({ user: { id: userId } }));
  }
}

export default DeckService;
