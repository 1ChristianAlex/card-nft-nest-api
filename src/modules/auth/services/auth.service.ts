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
    try {
      const user = await this._userService.getUserByEmail(email);

      if (!(await this._passwordHash.compareHash(user.password, password))) {
        throw new Error();
      }

      return user;
    } catch {
      throw new Error('Wrong email/password');
    }
  }
}

export default AuthService;
