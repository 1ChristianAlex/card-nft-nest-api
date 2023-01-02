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
    const [userWallet] = await this.deckRepository.find({
      where: { user: { id: userId } },
      relations: {
        user: true,
      },
    });

    return userWallet;
  }

  async refreshClaimdedTotal(userWallet: DeckEntity) {
    const cardsTotal = await this.cardRepository
      .createQueryBuilder('card')
      .where(`card.walletId = ${userWallet.id}`)
      .getCount();

    await this.deckRepository.update(
      { id: userWallet.id },
      { deckAmount: cardsTotal, claims: userWallet.claims - 1 },
    );
  }

  public async claimCard(cardId: number, userId: number) {
    const userWallet = await this.getUserWaller(userId);

    if (!userWallet.claims) {
      throw new Error('User can not claim right now');
    }

    await this.cardRepository.update(
      { id: cardId },
      {
        status: {
          id: CARD_STATUS_ENUM.CLAIMED,
        },
        wallet: userWallet,
      },
    );

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
}

export default DeckService;
