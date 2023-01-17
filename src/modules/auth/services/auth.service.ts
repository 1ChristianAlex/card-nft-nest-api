import { Injectable } from '@nestjs/common';
import PasswordHash from 'src/lib/passwordHash/passwordHash.service';
import { UserModel } from 'src/modules/user/services/user.model';
import UserService from '../../user/services/user.service';
import AuthMessages from './auth.messages';

@Injectable()
class AuthService {
  constructor(
    private _userService: UserService,
    private _passwordHash: PasswordHash,
  ) {}

  async doUserLogin(email: string, password: string): Promise<UserModel> {
    const user = await this._userService.getUserByEmail(email).catch(() => {
      throw new Error(AuthMessages.WRONG_ACCESS);
    });

    if (!user.isActive) {
      throw new Error(AuthMessages.USER_DEACTIVATED);
    }

    if (!(await this._passwordHash.compareHash(user.password, password))) {
      throw new Error(AuthMessages.WRONG_ACCESS);
    }

    return user;
  }
}

export default AuthService;
