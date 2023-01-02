import CardEntity from '../../card/entities/card.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import UserEntity from '../../user/entities/user.entity';

interface IDeckEntityConstructor {
  id: number;
  value: number;
  deckAmount: number;
  claims: number;
  gambles: number;
  nextGamble?: Date;
  user?: Partial<UserEntity>;
}

@Entity({
  schema: DeckEntity.tableInfo.schema,
  name: DeckEntity.tableInfo.name,
})
class DeckEntity {
  constructor(body: Partial<IDeckEntityConstructor>) {
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

  @Column({ type: 'timestamp' })
  public nextDaily?: Date;

  @UpdateDateColumn()
  public updatedDate?: Date;

  @CreateDateColumn()
  public createAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.wallet)
  public user: UserEntity;

  @OneToMany(() => CardEntity, (user) => user.wallet)
  public card: CardEntity;

  static readonly tableInfo = {
    name: 'deck',
    schema: 'card',
  };
}

export default DeckEntity;
