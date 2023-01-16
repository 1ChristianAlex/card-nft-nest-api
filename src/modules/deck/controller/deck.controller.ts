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
import { CommonOutputDto } from 'src/modules/common/common.dto';
import { UserOutputDto } from 'src/modules/user/controllers/user.dto';
import UserDecorator from 'src/modules/user/services/user.decorator';
import { DeckModel } from '../services/deck.model';
import DeckService from '../services/deck.service';
import { CardClaimInputDto } from './deck.dto';

@Controller('deck')
@UseGuards(JwtAuthGuard)
class DeckController {
  constructor(private deckService: DeckService) {}

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

  @Get('/dailyCoins')
  async invokeDailyCoins(@UserDecorator() user: UserOutputDto) {
    try {
      const added = await this.deckService.invokeDailyCoins(user.id);

      return new CommonOutputDto(`${added} added to you`);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('user')
  async getDeckFromUser(@UserDecorator() user: UserOutputDto) {
    try {
      const userDeck = await this.deckService.getUserDeck(user.id);

      return DeckModel.fromEntity(userDeck);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

export default DeckController;
