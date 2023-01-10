import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardValueTrade } from 'src/modules/card/services/card.model';
import { In, Repository } from 'typeorm';
import TransactionEntity, {
  TransactionStatus,
  TransactionType,
} from '../entities/transactions.entity';

@Injectable()
class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
  ) {}

  async registerTransaction(
    userId: number,
    payloadTraded: CardValueTrade,
    type: TransactionType,
    status: TransactionStatus,
    transactionId: number,
  ): Promise<TransactionEntity> {
    return this.transactionRepository.save(
      new TransactionEntity({
        cards: payloadTraded.cardListIds.map((id) => ({ id })),
        deck: { id: payloadTraded.deckId },
        wallet: payloadTraded.value,
        user: { id: userId },
        type,
        status,
        transaction: { id: transactionId || null },
      }),
    );
  }

  async updateTransaction(
    id: number,
    status: TransactionStatus,
  ): Promise<void> {
    const self = await this.transactionRepository
      .findOneOrFail({
        where: { id },
        relations: {
          transaction: true,
        },
      })
      .catch(() => {
        throw new Error('Transaction not found');
      });

    await this.transactionRepository.update(
      { id: In([self.id, self.transaction.id]) },
      { status },
    );
  }

  async getTransactionToTrade(
    transactionId: number,
  ): Promise<[CardValueTrade, CardValueTrade]> {
    const self = await this.transactionRepository
      .findOneOrFail({
        where: { id: transactionId },
        relations: {
          transaction: { deck: true, cards: true },
          deck: true,
          cards: true,
        },
      })
      .catch(() => {
        throw new Error('Transaction not found');
      });

    const target = self.transaction;

    const selfCardValueTrade = new CardValueTrade(
      self.deck.id,
      self.cards.map(({ id }) => id),
      self.wallet ?? 0,
    );

    const targetCardValueTrade = new CardValueTrade(
      target.deck.id,
      target.cards.map(({ id }) => id),
      self.wallet ?? 0,
    );

    return [selfCardValueTrade, targetCardValueTrade];
  }
}

export default TransactionService;
