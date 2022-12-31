import { Module } from '@nestjs/common';
import AuthModule from 'src/modules/auth/auth.module';
import UserModule from 'src/modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormDatabaseContext } from 'src/database/database';
import UserEntity from 'src/modules/user/entities/user.entity';
import RolesEntity from 'src/modules/user/entities/roles.entity';
import CardEntity from 'src/modules/card/entities/card.entity';
import TierEntity from 'src/modules/card/entities/tier.entity';
import ThumbsEntity from 'src/modules/card/entities/thumbs.entity';
import WalletEntity from 'src/modules/user/entities/wallet.entity';
import CardModule from 'src/modules/card/card.module';

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
      entities: [
        RolesEntity,
        UserEntity,
        CardEntity,
        TierEntity,
        ThumbsEntity,
        WalletEntity,
      ],
      synchronize: true,
      logging: true,
    }),
    UserModule,
    AuthModule,
    CardModule,
  ],
})
class AppModule {}

export default AppModule;
