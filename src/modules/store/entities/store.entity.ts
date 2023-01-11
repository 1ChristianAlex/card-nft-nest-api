import TransactionEntity from '../../deck/entities/transactions.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import CardEntity from '../../card/entities/card.entity';
import UserEntity from '../../user/entities/user.entity';

interface StoreEntityConstructor {
  price: number;
  user: Partial<UserEntity>;
  card: Partial<CardEntity>;
  transaction: Partial<TransactionEntity>;
}

@Entity({
  schema: StoreEntity.tableInfo.schema,
  name: StoreEntity.tableInfo.name,
})
class StoreEntity {
  constructor(entity: StoreEntityConstructor) {
    Object.assign(this, entity);
  }

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'integer', default: 0 })
  public price: number;

  @ManyToOne(() => UserEntity, (user) => user.store)
  public user: UserEntity;

  // @ManyToOne(() => DeckEntity, (deck) => deck.store)
  // public deck: DeckEntity;

  @ManyToOne(() => CardEntity, (card) => card.store)
  public card: CardEntity;

  @ManyToOne(() => TransactionEntity, (transaction) => transaction.store, {
    nullable: true,
  })
  public transaction: TransactionEntity;

  static readonly tableInfo = {
    name: 'store',
    schema: 'store',
  };
}

export default StoreEntity;
