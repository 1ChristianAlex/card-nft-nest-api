import { Controller, Post, Request } from '@nestjs/common';
import { UserOutputDto } from 'src/modules/user/controllers/user.dto';
import AuthService from '../services/auth.service';
import { LoginOutputDto } from './auth.dto';
import { Request as IRequest } from 'express';
import { User } from 'src/modules/user/services/user.model';
import { jwtConstants } from 'src/app/config';
import JwtAppService from '../services/jwt.service';

@Controller('auth')
class AuthController {
  constructor(
    private _authService: AuthService,
    private jwtAppService: JwtAppService,
  ) {}

  @Post('login')
  async login(@Request() req: IRequest & { user: User }) {
    const loginData = await this._authService.doUserLogin(
      req.body.email,
      req.body.password,
    );

    const userDto = UserOutputDto.adapterUserToDto(loginData);

    return new LoginOutputDto(userDto, this.jwtAppService.doSing(userDto));
  }
}

export default AuthController;
