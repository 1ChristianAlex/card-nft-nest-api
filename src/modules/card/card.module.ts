import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import SaveFileService from 'src/lib/file/saveFile.service';
import DeckEntity from '../deck/entities/deck.entity';
import DeckService from '../deck/services/deck.service';
import CardController from './controller/card.controller';
import ThumbnailController from './controller/thumbnail.controller';
import CardEntity from './entities/card.entity';
import ThumbsEntity from './entities/thumbs.entity';
import TierEntity from './entities/tier.entity';
import CardService from './services/card.service';
import CardPriceService from './services/cardPrice.service';
import ThumbnailService from './services/thumbnail.service';

@Module({
  controllers: [CardController, ThumbnailController],
  providers: [
    CardService,
    CardPriceService,
    DeckService,
    SaveFileService,
    ThumbnailService,
  ],
  imports: [
    TypeOrmModule.forFeature([
      CardEntity,
      ThumbsEntity,
      TierEntity,
      DeckEntity,
    ]),
  ],
})
class CardModule {}

export default CardModule;
