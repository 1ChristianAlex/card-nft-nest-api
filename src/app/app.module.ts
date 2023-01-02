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
import DeckEntity from 'src/modules/deck/entities/deck.entity';
import CardModule from 'src/modules/card/card.module';
import CardStatusEntity from 'src/modules/card/entities/cardStatus.entity';
import { ScheduleModule } from '@nestjs/schedule';
import DeckModule from 'src/modules/deck/deck.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
        DeckEntity,
        CardStatusEntity,
      ],
      synchronize: true,
      logging: true,
    }),
    UserModule,
    AuthModule,
    CardModule,
    DeckModule,
  ],
})
class AppModule {}

export default AppModule;
