import { Injectable } from '@nestjs/common';
import CardEntity from '../entities/card.entity';
import { CardModel } from './card.model';

@Injectable()
class CardPriceService {
  async applyTierMultiplayer(card: CardEntity) {
    const priceWithTier = card.price * card.tier.value;
    console.log({ priceWithTier });

    card.price = priceWithTier;

    return CardModel.entryToModel(card);
  }
}

export default CardPriceService;
