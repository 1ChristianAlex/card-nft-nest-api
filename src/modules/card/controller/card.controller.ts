import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  Put,
  Get,
  Delete,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/services/jwt-auth.guard';
import { UserOutputDto } from 'src/modules/user/controllers/user.dto';
import UserDecorator from 'src/modules/user/services/user.decorator';
import { CardModel } from '../services/card.model';
import CardService from '../services/card.service';
import { CardSimpleInputDto, CardInputDto } from './card.dto';

@Controller('card')
@UseGuards(JwtAuthGuard)
class CardController {
  constructor(private cardService: CardService) {}

  @Post()
  public async registerNewCard(
    @Body() cardDto: CardSimpleInputDto,
    @UserDecorator() user: UserOutputDto,
  ) {
    try {
      return this.cardService.registerNewCard(
        CardSimpleInputDto.dtoToModel(cardDto),
        user.id,
      );
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Put()
  public async updateCard(
    @Body() cardUpdate: CardInputDto,
  ): Promise<CardModel> {
    try {
      return this.cardService.updateCard(CardInputDto.dtoToModel(cardUpdate));
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Get('gamble')
  async getRandomCard(
    @UserDecorator() user: UserOutputDto,
  ): Promise<CardModel> {
    try {
      return this.cardService.getRandomCard(user.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('/discard/:cardId')
  async discardAndIncreseWallet(
    @Param('cardId', ParseIntPipe) cardId: number,
    @UserDecorator() user: UserOutputDto,
  ) {
    try {
      await this.cardService.discardCard(cardId, user.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('list/:deckId')
  async getCardList(
    @Param('deckId', ParseIntPipe) deckId: number,
  ): Promise<CardModel[]> {
    try {
      return this.cardService.listDeckCards(deckId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

export default CardController;
