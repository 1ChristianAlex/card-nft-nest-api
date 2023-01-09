import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import CardEntity from '../card/entities/card.entity';
import DeckController from './controller/deck.controller';
import DeckEntity from './entities/deck.entity';
import DeckService from './services/deck.service';
import DeckCronService from './services/deckCron.service';
import TradeService from './services/trade.service';

@Module({
  providers: [DeckService, DeckCronService, TradeService],
  controllers: [DeckController],
  imports: [TypeOrmModule.forFeature([DeckEntity, CardEntity])],
  exports: [DeckService],
})
class DeckModule {}

export default DeckModule;
