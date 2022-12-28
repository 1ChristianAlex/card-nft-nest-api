import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Entity,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import CardEntity from './card.entity';

@Entity({ schema: 'card' })
class ThumbsEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'text' })
  public description: string;

  @Column({ type: 'text' })
  public path: string;

  @ManyToOne(() => CardEntity, (card) => card.thumbnail)
  public card: CardEntity;

  @UpdateDateColumn()
  public updatedDate?: Date;

  @CreateDateColumn()
  public createAt?: Date;
}

export default ThumbsEntity;
