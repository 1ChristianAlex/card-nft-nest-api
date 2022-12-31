import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CardEntity from '../entities/card.entity';
import { CARD_STATUS_ENUM } from '../entities/cardStatus.entity';
import WalletEntity from '../entities/wallet.entity';

@Injectable()
class WalletService {
  constructor(
    @InjectRepository(WalletEntity)
    private walletRepository: Repository<WalletEntity>,
    @InjectRepository(CardEntity)
    private cardRepository: Repository<CardEntity>,
  ) {}

  async decreaseGambles(userId: number) {
    const userWallet = await this.walletRepository.findOneByOrFail({
      user: { id: userId },
    });

    if (!userWallet.gambles) {
      throw new Error('User hasnt gambles.');
    }

    await this.walletRepository.decrement(
      { user: { id: userId } },
      'gambles',
      1,
    );
  }

  async getUserWaller(userId: number) {
    const [userWallet] = await this.walletRepository.find({
      where: { user: { id: userId } },
      relations: {
        user: true,
      },
    });

    return userWallet;
  }

  async refreshClaimdedTotal(userWallet: WalletEntity) {
    const cardsTotal = await this.cardRepository
      .createQueryBuilder('card')
      .where(`card.walletId = ${userWallet.id}`)
      .getCount();

    await this.walletRepository.update(
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
}

export default WalletService;
