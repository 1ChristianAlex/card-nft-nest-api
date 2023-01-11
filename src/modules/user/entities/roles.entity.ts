import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import UserEntity from './user.entity';

@Entity({
  schema: RolesEntity.tableInfo.schema,
  name: RolesEntity.tableInfo.name,
})
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
  public user: UserEntity[];

  static readonly tableInfo = {
    name: 'roles',
    schema: 'user',
  };
}

export default RolesEntity;
