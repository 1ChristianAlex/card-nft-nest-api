import CardEntity from '../../card/entities/card.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import UserEntity from './user.entity';

interface IWalletEntityConstructor {
  id: number;
  value: number;
  deckAmount: number;
  claims: number;
  gambles: number;
  nextGamble?: Date;
  user?: Partial<UserEntity>;
}

@Entity({ schema: 'user' })
class WalletEntity {
  constructor(body: Partial<IWalletEntityConstructor>) {
    Object.assign(this, body);
  }

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'integer', default: 0 })
  public value: number;

  @Column({ type: 'integer', default: 0 })
  public deckAmount: number;

  @Column({ type: 'integer', default: 1 })
  public claims: number;

  @Column({ type: 'integer', default: 8 })
  public gambles: number;

  @Column({ type: 'timestamp' })
  public nextGamble?: Date;

  @UpdateDateColumn()
  public updatedDate?: Date;

  @CreateDateColumn()
  public createAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.wallet)
  public user: UserEntity;

  @ManyToOne(() => CardEntity, (user) => user.wallet)
  public card: CardEntity;
}

export default WalletEntity;
