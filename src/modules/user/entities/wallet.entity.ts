import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import UserEntity from './user.entity';

@Entity({ schema: 'user' })
class WalletEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'integer' })
  public value: number;

  @Column({ type: 'integer' })
  public deckAmount: number;

  @UpdateDateColumn()
  public updatedDate?: Date;

  @CreateDateColumn()
  public createAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.wallet)
  public user: UserEntity;
}

export default WalletEntity;
