import { Injectable } from '@nestjs/common';
import PasswordHash from 'src/lib/passwordHash/passwordHash.service';
import { User } from './user.model';

@Injectable()
class UserService {
  constructor(private _passwordHash: PasswordHash) {}

  public async getAllUser(): Promise<User[]> {
    return [
      new User({
        name: 'Christian',
        lastName: 'Alexsander',
        email: 'christianalexbh@hotmail.com',
        role: 1,
        password:
          '$2b$10$laAiJDQQP471pyawvu8LQOcoxwCeh9vxBRzlFYuRTCoFqz8JJZKcm',
        id: 1,
      }),

      new User({
        name: 'Pedro',
        lastName: 'Anjos',
        email: 'pedro@hotmail.com',
        role: 1,
        password: 'algumasenha',
        id: 2,
      }),
    ];
  }

  public async getUserById(id: number) {
    const users = await this.getAllUser();

    const userFinded = users.find((item) => item.id === id);

    return this.returnIfExists(userFinded);
  }

  private returnIfExists(userFinded: User) {
    if (!userFinded) {
      throw new Error('User not found');
    }

    return userFinded;
  }

  public async getUserByEmail(email: string) {
    const users = await this.getAllUser();

    const userFinded = users.find((item) => item.email === email);

    return this.returnIfExists(userFinded);
  }

  public async createNewUser(user: User) {
    const newUser = new User({
      ...user,
      password: await this._passwordHash.genHash(user.password),
    });

    return newUser;
  }
}

export default UserService;
