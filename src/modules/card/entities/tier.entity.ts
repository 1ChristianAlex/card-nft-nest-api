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
  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'text' })
  public name: string;

  @Column({ type: 'text' })
  public description: string;

  @UpdateDateColumn()
  public updatedDate?: Date;

  @CreateDateColumn()
  public createAt?: Date;

  @OneToMany(() => CardEntity, (card) => card.tier)
  public card: CardEntity;
}

export default TierEntity;
