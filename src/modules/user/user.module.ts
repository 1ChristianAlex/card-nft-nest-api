import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PasswordHash from 'src/lib/passwordHash/passwordHash.service';
import UserController from './controllers/user.controller';
import RolesEntity from './entities/roles.entity';
import UserEntity from './entities/user.entity';
import UserService from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RolesEntity])],
  controllers: [UserController],
  providers: [UserService, PasswordHash],
  exports: [UserService, TypeOrmModule],
})
class UserModule {}

export default UserModule;
