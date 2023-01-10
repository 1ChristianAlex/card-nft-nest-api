import { CardModel } from 'src/modules/card/services/card.model';
import TransactionEntity, {
  TransactionType,
  TransactionStatus,
} from '../entities/transactions.entity';

class TransactionModel {
  constructor(model: TransactionModel) {
    Object.assign(this, model);
  }

  public id: number;
  public wallet: number;
  public type: TransactionType;
  public status: TransactionStatus;
  public transactedAt: Date;
  public transaction?: TransactionModel;
  public cards?: CardModel[];

  static fromEntity(entity: TransactionEntity): TransactionModel {
    return new TransactionModel({
      wallet: entity.wallet,
      type: entity.type,
      status: entity.status,
      transactedAt: entity.transactedAt,
      transaction: entity.transaction
        ? TransactionModel.fromEntity(entity.transaction)
        : null,
      cards: entity.cards,
      id: entity.id,
    });
  }
}

export { TransactionModel };
