import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { UserOutputDto } from 'src/modules/user/controllers/user.dto';
import AuthService from '../services/auth.service';
import { LoginOutputDto } from './auth.dto';
import { Request as IRequest } from 'express';
import { User } from 'src/modules/user/services/user.model';
import JwtAppService from '../services/jwt.service';

@Controller('auth')
class AuthController {
  constructor(
    private _authService: AuthService,
    private jwtAppService: JwtAppService,
  ) {}

  @Post('login')
  async login(@Request() req: IRequest & { user: User }) {
    try {
      const loginData = await this._authService.doUserLogin(
        req.body.email,
        req.body.password,
      );

      const userDto = UserOutputDto.adapterUserToDto(loginData);

      return new LoginOutputDto(userDto, this.jwtAppService.doSing(userDto));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

export default AuthController;
