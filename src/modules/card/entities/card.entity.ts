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
import DeckEntity from '../../deck/entities/deck.entity';
import CardStatusEntity from './cardStatus.entity';

interface ICardEntityConstructor {
  name: string;
  description: string;
  price: number;
  likes: number;
  tier: TierEntity;
  thumbnail: ThumbsEntity[];
  id?: number;
  user?: Partial<UserEntity>;
  status?: Partial<CardStatusEntity>;
}

@Entity({
  schema: CardEntity.tableInfo.schema,
  name: CardEntity.tableInfo.name,
})
class CardEntity {
  constructor(card: ICardEntityConstructor) {
    Object.assign(this, card);
  }

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
  public updatedAt?: Date;

  @CreateDateColumn()
  public createAt?: Date;

  @ManyToOne(() => TierEntity, (tier) => tier.card)
  public tier: TierEntity;

  @ManyToOne(() => CardStatusEntity, (tier) => tier.card)
  public status: CardStatusEntity;

  @OneToMany(() => ThumbsEntity, (thumb) => thumb.card)
  public thumbnail: ThumbsEntity[];

  @ManyToOne(() => UserEntity, (user) => user.card)
  public user: UserEntity;

  @ManyToOne(() => DeckEntity, (deck) => deck.card)
  public deck: DeckEntity;

  static readonly tableInfo = {
    name: 'card',
    schema: 'card',
  };
}

export default CardEntity;
