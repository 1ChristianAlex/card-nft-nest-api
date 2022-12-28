import CardEntity from '../../card/entities/card.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import RolesEntity from './roles.entity';
import WalletEntity from './wallet.entity';

@Entity({ schema: 'user' })
class UserEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'text' })
  public name: string;

  @Column({ type: 'text' })
  public lastName: string;

  @Column({ type: 'text' })
  public email: string;

  @Column({ type: 'text' })
  public password: string;

  @Column({ default: true })
  public isActive: boolean;

  @UpdateDateColumn()
  public updatedDate?: Date;

  @CreateDateColumn()
  public createAt?: Date;

  @ManyToOne(() => RolesEntity, (role) => role.user)
  public role: RolesEntity;

  @OneToMany(() => CardEntity, (card) => card.user)
  public card: CardEntity;

  @OneToMany(() => WalletEntity, (wallet) => wallet.user)
  public wallet: WalletEntity;
}

export default UserEntity;
