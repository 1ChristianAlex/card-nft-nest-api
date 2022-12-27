import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserOutputDto } from 'src/modules/user/controllers/user.dto';
import { jwtConstants } from 'src/app/config';

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: UserOutputDto) {
    return payload;
  }
}

export default JwtStrategy;
