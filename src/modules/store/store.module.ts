import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import CardEntity from '../card/entities/card.entity';
import DeckEntity from '../deck/entities/deck.entity';
import TransactionEntity from '../deck/entities/transactions.entity';
import DeckService from '../deck/services/deck.service';
import TradeService from '../deck/services/trade.service';
import TransactionService from '../deck/services/transaction.service';
import StoreController from './controllers/store.controller';
import StoreEntity from './entities/store.entity';
import StoreService from './services/store.service';

@Module({
  providers: [StoreService, TradeService, DeckService, TransactionService],
  imports: [
    TypeOrmModule.forFeature([
      StoreEntity,
      CardEntity,
      TransactionEntity,
      DeckEntity,
    ]),
  ],
  controllers: [StoreController],
})
class StoreModule {}

export default StoreModule;
