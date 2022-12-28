import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/app/config';
import { UserOutputDto } from 'src/modules/user/controllers/user.dto';

@Injectable()
class JwtAppService {
  constructor(private jwtService: JwtService) {}

  doSing(userDto: UserOutputDto) {
    return this.jwtService.sign({ ...userDto }, JwtAppService.jwtOptions);
  }

  static readonly SECRET = jwtConstants.secret;

  static readonly jwtOptions = {
    secret: JwtAppService.SECRET,
    expiresIn: '1 day',
  };
}

export default JwtAppService;
