import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PasswordHash from 'src/lib/passwordHash/passwordHash.service';
import { Repository } from 'typeorm';
import RolesEntity from '../entities/roles.entity';
import UserEntity from '../entities/user.entity';
import { ROLES_ID, User } from './user.model';

@Injectable()
class UserService {
  constructor(
    private _passwordHash: PasswordHash,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(RolesEntity)
    private roleRepository: Repository<RolesEntity>,
  ) {}

  public async getAllUser(): Promise<User[]> {
    const allUsers = await this.usersRepository.find();

    return allUsers.map(User.adapterEntityToModel);
  }

  public async getUserById(id: number) {
    const userById = await this.usersRepository.findOneBy({ id });
    return this.returnIfExists(User.adapterEntityToModel(userById));
  }

  private returnIfExists(userFinded: User) {
    if (!userFinded) {
      throw new Error('User not found');
    }

    return userFinded;
  }

  public async getUserByEmail(email: string) {
    const [userByEmail] = await this.usersRepository.find({
      where: { email },
      relations: { role: true },
    });

    return this.returnIfExists(User.adapterEntityToModel(userByEmail));
  }

  public async createNewUser(user: User) {
    const role = await this.roleRepository.findOneBy({
      id: user.role.id ?? ROLES_ID.PLAYER,
    });

    const newUser = new UserEntity({
      password: await this._passwordHash.genHash(user.password),
      email: user.email,
      lastName: user.lastName,
      name: user.name,
      role: role,
    });

    const userSaved = await this.usersRepository.save(newUser);

    return User.adapterEntityToModel(userSaved);
  }
}

export default UserService;
