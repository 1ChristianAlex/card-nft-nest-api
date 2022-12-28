import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import ThumbsEntity from './thumbs.entity';
import TierEntity from './tier.entity';
import UserEntity from '../../user/entities/user.entity';

@Entity({ schema: 'card' })
class CardEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'text' })
  public name: string;

  @Column({ type: 'text' })
  public description: string;

  @Column({ type: 'integer', default: 30 })
  public price: number;

  @Column({ type: 'integer' })
  public likes: number;

  @UpdateDateColumn()
  public updatedDate?: Date;

  @CreateDateColumn()
  public createAt?: Date;

  @ManyToOne(() => TierEntity, (tier) => tier.card)
  public tier: TierEntity;

  @OneToMany(() => ThumbsEntity, (role) => role.card)
  public thumbnail: ThumbsEntity;

  @ManyToOne(() => UserEntity, (user) => user.card)
  public user: UserEntity;
}

export default CardEntity;
