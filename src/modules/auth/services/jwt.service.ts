import { getConfigToken } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserOutputDto } from 'src/modules/user/controllers/user.dto';

@Injectable()
class JwtAppService {
  constructor(private jwtService: JwtService) {}

  doSing(userDto: UserOutputDto) {
    return this.jwtService.sign({ ...userDto }, JwtAppService.jwtOptions);
  }

  static readonly SECRET = getConfigToken('JWT_SECRET');

  static readonly jwtOptions = {
    secret: JwtAppService.SECRET,
    expiresIn: '1d',
  };
}

export default JwtAppService;
