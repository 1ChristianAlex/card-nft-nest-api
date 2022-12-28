import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import UserEntity from './user.entity';

@Entity({ schema: 'user' })
class RolesEntity {
  constructor(description: string) {
    this.description = description;
  }

  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'text' })
  public description: string;

  @UpdateDateColumn()
  public updatedDate?: Date;

  @CreateDateColumn()
  public createAt?: Date;

  @OneToMany(() => UserEntity, (user) => user.role)
  public user: UserEntity;
}

export default RolesEntity;
