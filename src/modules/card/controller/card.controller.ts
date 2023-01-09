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
      const newCard = this.cardService.registerNewCard(
        CardSimpleInputDto.dtoToModel(cardDto),
        user.id,
      );

      return newCard;
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Put()
  public async updateCard(@Body() cardUpdate: CardInputDto) {
    try {
      const update = this.cardService.updateCard(
        CardInputDto.dtoToModel(cardUpdate),
      );

      return update;
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Get('gamble')
  async getRandomCard(@UserDecorator() user: UserOutputDto) {
    try {
      const update = await this.cardService.getRandomCard(user.id);

      return update;
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
}

export default CardController;
