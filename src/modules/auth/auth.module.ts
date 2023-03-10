import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import PasswordHash from 'src/lib/passwordHash/passwordHash.service';
import UserModule from '../user/user.module';
import AuthController from './controller/auth.controller';
import AuthService from './services/auth.service';
import JwtStrategy from './services/jwt.strategy';
import JwtAppService from './services/jwt.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: JwtAppService.SECRET,
      signOptions: JwtAppService.jwtOptions,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordHash,
    JwtStrategy,
    JwtService,
    JwtAppService,
  ],
  exports: [AuthService],
})
class AuthModule {}

export default AuthModule;
