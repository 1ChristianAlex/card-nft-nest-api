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
import { ROLES_ID } from 'src/modules/user/services/user.model';
import DeckService from '../services/deck.service';
import TradeService from '../services/trade.service';
import {
  CardClaimInputDto,
  DeckTradeInputDto,
  DeckTradeItemInputDto,
} from './deck.dto';

@Controller('deck')
@UseGuards(JwtAuthGuard)
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
    if (user.role.id !== ROLES_ID.ADMIN && self.userId !== user.id) {
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
    @Body() cardClaim: CardClaimInputDto,
    @UserDecorator() user: UserOutputDto,
  ) {
    try {
      await this.deckService.claimCard(cardClaim.id, user.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/daily')
  async invokeDailyReset(@UserDecorator() user: UserOutputDto) {
    try {
      await this.deckService.invokeDailyReset(user.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

export default DeckController;
