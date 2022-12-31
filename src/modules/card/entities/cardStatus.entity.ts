import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import CardEntity from './card.entity';

enum CARD_STATUS_ENUM {
  FREE = 1,
  IN_GAMBLE,
  CLAIMED,
}

@Entity({
  schema: CardStatusEntity.tableInfo.schema,
  name: CardStatusEntity.tableInfo.name,
})
class CardStatusEntity {
  constructor(body: Partial<CardStatusEntity>) {
    Object.assign(this, body);
  }

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'text' })
  public name: string;

  @UpdateDateColumn()
  public updatedDate?: Date;

  @CreateDateColumn()
  public createAt?: Date;

  @OneToMany(() => CardEntity, (card) => card.tier)
  public card: CardEntity;

  static readonly tableInfo = {
    name: 'status',
    schema: 'card',
  };
}

export { CARD_STATUS_ENUM };
export default CardStatusEntity;
