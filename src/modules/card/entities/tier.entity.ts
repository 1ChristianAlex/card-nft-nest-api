import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import CardEntity from './card.entity';

@Entity({ schema: 'card' })
class TierEntity {
  constructor(name: string, description: string, value: number) {
    this.name = name;
    this.description = description;

    this.value = value;
  }

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'text' })
  public name: string;

  @Column({ type: 'text' })
  public description: string;

  @Column({ type: 'integer' })
  public value: number;

  @UpdateDateColumn()
  public updatedDate?: Date;

  @CreateDateColumn()
  public createAt?: Date;

  @OneToMany(() => CardEntity, (card) => card.tier)
  public card: CardEntity;
}

export default TierEntity;
