import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    const userWallet = await this.deckRepository.findOneOrFail({
      where: { user: { id: userId } },
      relations: {
        user: true,
      },
    });

    return userWallet;
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

    const cardToBeClaimed = await this.cardRepository.findOneOrFail({
      where: {
        id: cardId,
        status: {
          id: CARD_STATUS_ENUM.IN_GAMBLE,
        },
      },
      relations: { status: true },
    });

    await this.cardRepository.update(cardToBeClaimed, {
      status: {
        id: CARD_STATUS_ENUM.CLAIMED,
      },
      wallet: userWallet,
    });

    this.refreshClaimdedTotal(userWallet);
  }

  public async refreshAllGumbles() {
    const nextGamble = new Date();

    nextGamble.setHours(nextGamble.getHours() + 1);

    await this.deckRepository.update(null, { gambles: 8, nextGamble });
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
      { user: { id: userId } },
      { gambles: 8, nextGamble: nextDaily },
    );
  }

  async changeDeckWallet(userId: number, value: number, isIncresing = true) {
    const userDeck = await this.deckRepository.findOneByOrFail({
      user: { id: userId },
    });

    if (isIncresing) {
      userDeck.wallet + value;
    } else {
      userDeck.wallet - value;
    }

    await this.deckRepository.update({ user: { id: userId } }, userDeck);
  }
}

export default DeckService;
