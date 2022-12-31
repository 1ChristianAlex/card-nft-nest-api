import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PasswordHash from 'src/lib/passwordHash/passwordHash.service';
import UserController from './controllers/user.controller';
import RolesEntity from './entities/roles.entity';
import UserEntity from './entities/user.entity';
import WalletEntity from './entities/wallet.entity';
import UserService from './services/user.service';
import WalletService from './services/wallet.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RolesEntity, WalletEntity])],
  controllers: [UserController],
  providers: [UserService, PasswordHash, WalletService],
  exports: [UserService, TypeOrmModule, WalletService],
})
class UserModule {}

export default UserModule;
