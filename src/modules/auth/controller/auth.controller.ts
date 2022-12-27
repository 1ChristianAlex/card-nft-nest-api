import { Controller, Post, Request } from '@nestjs/common';
import { UserOutputDto } from 'src/modules/user/controllers/user.dto';
import AuthService from '../services/auth.service';
import { LoginOutputDto } from './auth.dto';
import { Request as IRequest } from 'express';
import { User } from 'src/modules/user/services/user.model';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/app/config';

@Controller('auth')
class AuthController {
  constructor(
    private _authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('login')
  async login(@Request() req: IRequest & { user: User }) {
    const loginData = await this._authService.doUserLogin(
      req.body.email,
      req.body.password,
    );

    const userDto = UserOutputDto.adapterUserToDto(loginData);

    return new LoginOutputDto(
      userDto,
      this.jwtService.sign(
        { ...userDto },
        {
          secret: jwtConstants.secret,
          expiresIn: '1 day',
        },
      ),
    );
  }
}

export default AuthController;
