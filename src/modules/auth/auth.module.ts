import { Module } from '@nestjs/common';
import PasswordHash from 'src/lib/passwordHash/passwordHash.service';
import UserService from '../user/services/user.service';
import AuthController from './controller/auth.controller';
import AuthService from './services/auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UserService, PasswordHash],
})
class AuthModule {}

export default AuthModule;
