import { Injectable } from '@nestjs/common';
import PasswordHash from 'src/lib/passwordHash/passwordHash.service';
import UserService from '../../user/services/user.service';

@Injectable()
class AuthService {
  constructor(
    private _userService: UserService,
    private _passwordHash: PasswordHash,
  ) {}

  async doUserLogin(email: string, password: string) {
    const user = await this._userService.getUserByEmail(email).catch(() => {
      throw new Error('Wrong email/password');
    });

    if (!user.isActive) {
      throw new Error('User is no longer active');
    }

    if (!(await this._passwordHash.compareHash(user.password, password))) {
      throw new Error('Wrong email/password');
    }

    return user;
  }
}

export default AuthService;
