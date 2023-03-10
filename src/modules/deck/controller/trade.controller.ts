import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/services/jwt-auth.guard';
import { CardValueTrade } from 'src/modules/card/services/card.model';
import { UserOutputDto } from 'src/modules/user/controllers/user.dto';
import UserDecorator from 'src/modules/user/services/user.decorator';
import DeckService from '../services/deck.service';
import TradeService from '../services/trade.service';
import { TransactionModel } from '../services/transaction.model';
import TransactionService from '../services/transaction.service';
import {
  AcceptTradeTransactionInputDto,
  DeckTradeInputDto,
  DeckTradeItemInputDto,
} from './deck.dto';

@Controller('trade')
@UseGuards(JwtAuthGuard)
class TradeController {
  constructor(
    private tradeService: TradeService,
    public transactionService: TransactionService,
    public deckService: DeckService,
  ) {}

  @Post('request')
  async tradeCards(
    @Body() tradeCardInputPack: DeckTradeInputDto,
  ): Promise<void> {
    const { self, target } = tradeCardInputPack;

    try {
      await this.tradeService.requestTrade(
        new CardValueTrade(self.deckId, self.cardIds, self.value),
        new CardValueTrade(target.deckId, target.cardIds, target.value),
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('accept')
  async acceptTrade(
    @Body() acceptTradeTransaction: AcceptTradeTransactionInputDto,
  ): Promise<void> {
    return this.tradeAction(acceptTradeTransaction, true);
  }

  @Post('decline')
  async declineTrade(
    @Body() acceptTradeTransaction: AcceptTradeTransactionInputDto,
  ): Promise<void> {
    return this.tradeAction(acceptTradeTransaction, false);
  }

  private async tradeAction(
    acceptTradeTransaction: AcceptTradeTransactionInputDto,
    accept: boolean,
  ): Promise<void> {
    try {
      if (accept) {
        await this.tradeService.doTrade(acceptTradeTransaction.id);
      } else {
        await this.tradeService.declineTrade(acceptTradeTransaction.id);
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('give')
  async give(
    @Body() toGive: DeckTradeItemInputDto,
    @UserDecorator() user: UserOutputDto,
  ): Promise<void> {
    try {
      const selfDeck = await this.deckService.getUserDeck(user.id);
      await this.tradeService.giveCard(
        new CardValueTrade(selfDeck.id, toGive.cardIds, toGive.value),
        toGive.deckId,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/pedingRequest')
  async getPedingRequest(
    @UserDecorator() user: UserOutputDto,
  ): Promise<TransactionModel[]> {
    return this.getPendingTransactions(user, true);
  }

  private async getPendingTransactions(
    user: UserOutputDto,
    isOwner: boolean,
  ): Promise<TransactionModel[]> {
    try {
      return this.transactionService.getUserDeckPendingAccepts(
        user.id,
        isOwner,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/pedingAccepts')
  async getPedingAccepts(
    @UserDecorator() user: UserOutputDto,
  ): Promise<TransactionModel[]> {
    return this.getPendingTransactions(user, false);
  }
}

export default TradeController;
