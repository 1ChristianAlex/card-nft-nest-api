import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardValueTrade } from 'src/modules/card/services/card.model';
import CommonMessages from 'src/modules/common/common.messages';
import { In, IsNull, Not, Repository } from 'typeorm';
import TransactionEntity, {
  TransactionStatus,
  TransactionType,
} from '../entities/transactions.entity';
import { TransactionModel } from './transaction.model';

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
        coins: payloadTraded.value,
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
        where: { id, status: TransactionStatus.REQUEST },
        relations: {
          transaction: true,
        },
      })
      .catch(() => {
        throw new Error(CommonMessages.NOT_FOUND);
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
        throw new Error(CommonMessages.NOT_FOUND);
      });

    const target = self.transaction;

    const selfCardValueTrade = new CardValueTrade(
      self.deck.id,
      self.cards.map(({ id }) => id),
      self.coins ?? 0,
    );

    const targetCardValueTrade = new CardValueTrade(
      target.deck.id,
      target.cards.map(({ id }) => id),
      target.coins ?? 0,
    );

    return [selfCardValueTrade, targetCardValueTrade];
  }

  public async getUserDeckPendingAccepts(
    userId: number,
    isOwner: boolean,
  ): Promise<TransactionModel[]> {
    const pending = await this.transactionRepository.find({
      where: {
        status: TransactionStatus.REQUEST,
        type: TransactionType.TRADE,
        deck: { user: { id: userId } },
        transaction: { id: isOwner ? IsNull() : Not(IsNull()) },
      },
      relations: { deck: true, transaction: { deck: true } },
    });

    return pending.map(TransactionModel.fromEntity);
  }
}

export default TransactionService;
