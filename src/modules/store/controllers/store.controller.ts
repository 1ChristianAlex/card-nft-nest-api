import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/services/jwt-auth.guard';
import { UserOutputDto } from 'src/modules/user/controllers/user.dto';
import UserDecorator from 'src/modules/user/services/user.decorator';
import { StoreModel } from '../services/store.model';
import StoreService from '../services/store.service';
import { StoreInputDto, StorePurchaseInputDto } from './store.dto';

@Controller('store')
@UseGuards(JwtAuthGuard)
class StoreController {
  constructor(private storeService: StoreService) {}

  @Post('market')
  async registerCardInStore(
    @Body() body: StoreInputDto,
    @UserDecorator() user: UserOutputDto,
  ) {
    try {
      await this.storeService.registerCardInStore(
        new StoreModel({
          card: { id: body.cardId },
          price: body.marketPrice,
          user: { id: user.id },
        }),
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('purchase')
  async purchaseCardInMarket(
    @Body() body: StorePurchaseInputDto,
    @UserDecorator() user: UserOutputDto,
  ) {
    try {
      await this.storeService.purchaseCardInStore(body.storeId, user.id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

export default StoreController;
