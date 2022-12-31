import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import WalletEntity from './entities/wallet.entity';
import WalletService from './services/wallet.service';
import CardController from './controller/card.controller';
import CardEntity from './entities/card.entity';
import ThumbsEntity from './entities/thumbs.entity';
import TierEntity from './entities/tier.entity';
import CardService from './services/card.service';
import CardPriceService from './services/cardPrice.service';

@Module({
  controllers: [CardController],
  providers: [CardService, CardPriceService, WalletService],
  imports: [
    TypeOrmModule.forFeature([
      CardEntity,
      ThumbsEntity,
      TierEntity,
      WalletEntity,
    ]),
  ],
})
class CardModule {}

export default CardModule;
