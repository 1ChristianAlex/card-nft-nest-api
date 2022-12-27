import { Body, Controller, Post } from '@nestjs/common';
import { UserOutputDto } from 'src/modules/user/controllers/user.dto';
import AuthService from '../services/auth.service';
import { LoginInputDto } from './auth.dto';

@Controller('auth')
class AuthController {
  constructor(private _authService: AuthService) {}

  @Post('login')
  async login(@Body() loginBody: LoginInputDto) {
    const user = await this._authService.doUserLogin(
      loginBody.email,
      loginBody.password,
    );

    return UserOutputDto.adapterUserToDto(user);
  }
}

export default AuthController;
