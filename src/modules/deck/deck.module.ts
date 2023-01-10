import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import CardEntity from '../card/entities/card.entity';
import DeckController from './controller/deck.controller';
import TradeController from './controller/trade.controller';
import DeckEntity from './entities/deck.entity';
import TransactionEntity from './entities/transactions.entity';
import DeckService from './services/deck.service';
import DeckCronService from './services/deckCron.service';
import TradeService from './services/trade.service';
import TransactionService from './services/transaction.service';

@Module({
  providers: [DeckService, DeckCronService, TradeService, TransactionService],
  controllers: [DeckController, TradeController],
  imports: [
    TypeOrmModule.forFeature([DeckEntity, CardEntity, TransactionEntity]),
  ],
  exports: [DeckService],
})
class DeckModule {}

export default DeckModule;
