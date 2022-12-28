import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserOutputDto } from 'src/modules/user/controllers/user.dto';
import JwtAppService from './jwt.service';

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JwtAppService.SECRET,
    });
  }

  async validate(payload: UserOutputDto) {
    return payload;
  }
}

export default JwtStrategy;
