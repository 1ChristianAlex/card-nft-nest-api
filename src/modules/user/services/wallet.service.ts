import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import WalletEntity from '../entities/wallet.entity';

@Injectable()
class WalletService {
  constructor(
    @InjectRepository(WalletEntity)
    private walletRepository: Repository<WalletEntity>,
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
}

export default WalletService;
