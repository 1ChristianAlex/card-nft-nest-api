import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CardEntity from '../entities/card.entity';
import { CARD_TIER } from './card.model';

@Injectable()
class CardPriceService {
  constructor(
    @InjectRepository(CardEntity)
    private cardRepository: Repository<CardEntity>,
  ) {}

  applyTierMultiplier(card: CardEntity): CardEntity {
    card.price = this.doTierMultiplier(card);

    return card;
  }

  doTierMultiplier(card: CardEntity): number {
    return card.price * card.tier.value;
  }

  async checkCardTier(card: CardEntity): Promise<void> {
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
    if (currentTier !== card.tier?.id) {
      await this.cardRepository.update(
        { id: card.id },
        { tier: { id: currentTier } },
      );
    }
  }
}

export default CardPriceService;
