import CardEntity from '../../card/entities/card.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToMany,
  ManyToOne,
  Column,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import DeckEntity from './deck.entity';
import UserEntity from '../../user/entities/user.entity';

enum TransactionType {
  TRADE = 'TRADE',
  GIVE = 'GIVE',
}
enum TransactionStatus {
  REQUEST = 'REQUEST',
  ACCEPT = 'ACCEPT',
  DENIED = 'DENIED',
}

interface TransactionEntityContructor {
  wallet: number;
  type: TransactionType;
  status: TransactionStatus;

  deck: Partial<DeckEntity>;
  cards: Partial<CardEntity>[];
  user: Partial<UserEntity>;

  transaction?: Partial<TransactionEntity>;
}

@Entity({
  schema: TransactionEntity.tableInfo.schema,
  name: TransactionEntity.tableInfo.name,
})
class TransactionEntity {
  constructor(entity: TransactionEntityContructor) {
    Object.assign(this, entity);
  }

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'integer', default: 0 })
  public wallet: number;

  @Column({ type: 'text' })
  public type: TransactionType;

  @Column({ type: 'text', default: TransactionStatus.REQUEST })
  public status: TransactionStatus;

  @CreateDateColumn()
  public transactedAt?: Date;

  @ManyToOne(() => DeckEntity, (deck) => deck.transaction)
  public deck: DeckEntity;

  // user who create a request
  @ManyToOne(() => UserEntity, (user) => user.wallet)
  public user: UserEntity;

  @OneToOne(() => TransactionEntity, (transaction) => transaction.transaction, {
    nullable: true,
  })
  @JoinColumn()
  public transaction: TransactionEntity;

  @ManyToMany(() => CardEntity)
  @JoinTable()
  public cards: CardEntity[];

  static readonly tableInfo = {
    name: 'transaction',
    schema: 'card',
  };
}

export { TransactionType, TransactionStatus };

export default TransactionEntity;
