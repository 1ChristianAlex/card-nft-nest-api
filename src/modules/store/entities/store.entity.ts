import TransactionEntity from '../../deck/entities/transactions.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import CardEntity from '../../card/entities/card.entity';
import UserEntity from '../../user/entities/user.entity';
import DeckEntity from '../../deck/entities/deck.entity';

@Entity({
  schema: StoreEntity.tableInfo.schema,
  name: StoreEntity.tableInfo.name,
})
class StoreEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'integer', default: 0 })
  public price: number;

  @ManyToOne(() => UserEntity, (user) => user.store)
  public user: UserEntity;

  @ManyToOne(() => DeckEntity, (deck) => deck.store)
  public deck: DeckEntity;

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
