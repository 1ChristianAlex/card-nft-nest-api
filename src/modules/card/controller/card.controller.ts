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
import {
  CardGambleOutputDto,
  CardSimpleInputDto,
  CardUpdateInputDto,
} from './card.dto';

@Controller('card')
@UseGuards(JwtAuthGuard)
class CardController {
  constructor(private cardService: CardService) {}

  @Post()
  public async registerNewCard(
    @Body() cardDto: CardSimpleInputDto,
    @UserDecorator() user: UserOutputDto,
  ): Promise<CardModel> {
    try {
      return await this.cardService.registerNewCard(
        CardSimpleInputDto.dtoToModel(cardDto),
        user.id,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Put()
  public async updateCard(
    @Body() cardUpdate: CardUpdateInputDto,
  ): Promise<CardModel> {
    try {
      return await this.cardService.updateCard(
        CardUpdateInputDto.toModel(cardUpdate),
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Get('gamble')
  async getRandomCard(
    @UserDecorator() user: UserOutputDto,
  ): Promise<CardGambleOutputDto> {
    try {
      const cardModel = await this.cardService.getRandomCard(user.id);

      return new CardGambleOutputDto(cardModel, this.cardService.claimTime);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('/discard/:cardId')
  async discardAndIncreseCoins(
    @Param('cardId', ParseIntPipe) cardId: number,
    @UserDecorator() user: UserOutputDto,
  ): Promise<void> {
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
      return await this.cardService.listDeckCards(deckId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

export default CardController;
