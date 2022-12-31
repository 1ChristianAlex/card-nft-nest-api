import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  Put,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/services/jwt-auth.guard';
import { UserOutputDto } from 'src/modules/user/controllers/user.dto';
import UserDecorator from 'src/modules/user/services/user.decorator';
import CardService from '../services/card.service';
import WalletService from '../services/wallet.service';
import { CardClaimDto, CardInputDto, CardUpdateInputDto } from './card.dto';

@Controller('card')
@UseGuards(JwtAuthGuard)
class CardController {
  constructor(
    private cardService: CardService,
    private walletService: WalletService,
  ) {}

  @Post()
  public async registerNewCard(
    @Body() cardDto: CardInputDto,
    @UserDecorator() user: UserOutputDto,
  ) {
    try {
      const newCard = this.cardService.registerNewCard(
        CardInputDto.dtoToModel(cardDto),
        user.id,
      );

      return newCard;
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Put()
  public async updateCard(@Body() cardUpdate: CardUpdateInputDto) {
    try {
      const update = this.cardService.updateCard(
        CardUpdateInputDto.dtoToModel(cardUpdate),
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
      return new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }

  @Post('claim')
  async claimCard(
    @Body() cardClaim: CardClaimDto,
    @UserDecorator() user: UserOutputDto,
  ) {
    try {
      await this.walletService.claimCard(cardClaim.id, user.id);
    } catch (error) {
      return new HttpException(error.message, HttpStatus.BAD_GATEWAY);
    }
  }
}

export default CardController;
