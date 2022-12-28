import { Module } from '@nestjs/common';
import AuthModule from 'src/modules/auth/auth.module';
import UserModule from 'src/modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfigToken } from '@nestjs/config';
import { ormDatabaseContext } from 'src/database/database';
import UserEntity from 'src/modules/user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: ormDatabaseContext.type as 'postgres',
      host: ormDatabaseContext.host,
      port: ormDatabaseContext.port,
      username: ormDatabaseContext.username,
      password: ormDatabaseContext.password,
      database: ormDatabaseContext.database,
      entities: [UserEntity],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
  ],
})
class AppModule {}

export default AppModule;
