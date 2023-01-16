import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PasswordHash from 'src/lib/passwordHash/passwordHash.service';
import DeckService from 'src/modules/deck/services/deck.service';
import { Repository } from 'typeorm';
import RolesEntity from '../entities/roles.entity';
import UserEntity from '../entities/user.entity';
import { ROLES_ID, UserModel } from './user.model';

@Injectable()
class UserService {
  constructor(
    private _passwordHash: PasswordHash,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    @InjectRepository(RolesEntity)
    private roleRepository: Repository<RolesEntity>,
    private deckService: DeckService,
  ) {}

  public async getAllUser(): Promise<UserModel[]> {
    const allUsers = await this.usersRepository.find({
      relations: { role: true, deck: true },
    });

    return allUsers.map(UserModel.fromEntity);
  }

  public async getUserById(id: number) {
    try {
      const userById = await this.usersRepository.findOneOrFail({
        where: { id },
        relations: { role: true },
      });
      return UserModel.fromEntity(userById);
    } catch {
      throw new Error('User not found');
    }
  }

  public async getUserByEmail(email: string) {
    try {
      const [userByEmail] = await this.usersRepository.find({
        where: { email },
        relations: { role: true },
      });

      return UserModel.fromEntity(userByEmail);
    } catch (error) {
      throw new Error('User not found');
    }
  }

  public async createNewUser(user: UserModel) {
    const role = await this.roleRepository.findOneBy({
      id: ROLES_ID.PLAYER,
    });

    const newUser = new UserEntity({
      password: await this._passwordHash.genHash(user.password),
      email: user.email,
      lastName: user.lastName,
      name: user.name,
      role,
    });

    const userSaved = await this.usersRepository.save(newUser);

    await this.deckService.newDeck(userSaved.id);

    return UserModel.fromEntity(userSaved);
  }
}

export default UserService;
