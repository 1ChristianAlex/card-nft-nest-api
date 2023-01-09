import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CardEntity from '../entities/card.entity';
import { CardModel, CARD_TIER } from './card.model';

@Injectable()
class CardPriceService {
  constructor(
    @InjectRepository(CardEntity)
    private cardRepository: Repository<CardEntity>,
  ) {}

  async applyTierMultiplayer(card: CardEntity) {
    const priceWithTier = card.price * card.tier.value;

    card.price = priceWithTier;

    return CardModel.entryToModel(card);
  }

  async checkCardTier(card: CardEntity) {
    let currentTier = card.tier.id;

    if (card.price <= 400) {
      currentTier = CARD_TIER.SILVER;
    }

    if (card.price > 400) {
      currentTier = CARD_TIER.GOLD;
    }

    if (card.price >= 800) {
      currentTier = CARD_TIER.PLAT;
    }

    await this.cardRepository.update(
      { id: card.id },
      { tier: { id: currentTier } },
    );
  }
}

export default CardPriceService;
