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

interface IUserEntityConstructor {
  name: string;
  lastName: string;
  email: string;
  password: string;
  role?: RolesEntity;
  card?: CardEntity;
  wallet?: WalletEntity;
}

@Entity({ schema: 'user' })
class UserEntity {
  constructor(entityValue: IUserEntityConstructor) {
    Object.assign(this, entityValue);
  }

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