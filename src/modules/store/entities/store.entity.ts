import TransactionEntity from '../../deck/entities/transactions.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
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

  @UpdateDateColumn()
  public updatedAt?: Date;

  @CreateDateColumn()
  public createAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.store)
  public user: UserEntity;

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
