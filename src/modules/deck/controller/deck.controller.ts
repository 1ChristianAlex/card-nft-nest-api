import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CardValueTrade } from 'src/modules/card/services/card.model';
import { UserOutputDto } from 'src/modules/user/controllers/user.dto';
import UserDecorator from 'src/modules/user/services/user.decorator';
import { ROLES_ID } from 'src/modules/user/services/user.model';
import DeckService from '../services/deck.service';
import TradeService from '../services/trade.service';
import {
  CardClaimDto,
  DeckTradeInputDto,
  DeckTradeItemInputDto,
} from './deck.dto';

@Controller('deck')
class DeckController {
  constructor(
    private tradeService: TradeService,
    private deckService: DeckService,
  ) {}

  @Post('trade')
  async tradeCards(
    @Body() tradeCardInputPack: DeckTradeInputDto,
    @UserDecorator() user: UserOutputDto,
  ) {
    const { self, target } = tradeCardInputPack;
    if (user.role.id === ROLES_ID.ADMIN && self.userId !== user.id) {
      throw new HttpException(
        'User must be admin to trade card that is not owner.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      await this.tradeService.tradeCards(
        new CardValueTrade(self.userId, self.cardIds, self.value),
        new CardValueTrade(target.userId, target.cardIds, target.value),
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('give')
  async give(
    @Body() toGive: DeckTradeItemInputDto,
    @UserDecorator() user: UserOutputDto,
  ) {
    try {
      await this.tradeService.giveCard(
        new CardValueTrade(user.id, toGive.cardIds, toGive.value),
        toGive.userId,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('claim')
  async claimCard(
    @Body() cardClaim: CardClaimDto,
    @UserDecorator() user: UserOutputDto,
  ) {
    try {
      await this.deckService.claimCard(cardClaim.id, user.id);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Get('/daily')
  async invokeDailyReset(@UserDecorator() user: UserOutputDto) {
    try {
      await this.deckService.invokeDailyReset(user.id);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }
}

export default DeckController;
