import { Module } from '@nestjs/common';
import PasswordHash from 'src/lib/passwordHash/passwordHash.service';
import UserController from './controllers/user.controller';
import UserService from './services/user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PasswordHash],
})
class UserModule {}

export default UserModule;
