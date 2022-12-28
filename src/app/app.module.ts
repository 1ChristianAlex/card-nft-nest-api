import { Module } from '@nestjs/common';
import AuthModule from 'src/modules/auth/auth.module';
import UserModule from 'src/modules/user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UserModule, AuthModule],
})
class AppModule {}

export default AppModule;
