import CardEntity from '../entities/card.entity';
import ThumbsEntity from '../entities/thumbs.entity';
import TierEntity from '../entities/tier.entity';

enum CARD_TIER {
  SILVER = 1,
  GOLD,
  PLAT,
}

class CardTier {
  constructor(tier: CardTier) {
    Object.assign(this, tier);
  }

  public id: number;
  public name: string;
  public description: string;
  public value: number;

  static fromEntity(entity: TierEntity): CardTier {
    return new CardTier({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      value: entity.value,
    });
  }
}

class Thumbnail {
  constructor(thumb: Thumbnail) {
    Object.assign(this, thumb);
  }

  public id: number;

  public description: string;

  public path: string;

  public position: number;

  static fromEntity(entity: ThumbsEntity): Thumbnail {
    return new Thumbnail({
      id: entity.id,
      description: entity.description,
      path: entity.path,
      position: entity.position,
    });
  }
}

class CardModel {
  constructor(card: CardModel) {
    Object.assign(this, card);
  }
  public id: number;

  public name: string;

  public description: string;

  public price: number;

  public likes: number;

  public tier?: CardTier;

  public thumbnail?: Thumbnail[];

  static fromEntity(entity: CardEntity): CardModel {
    return new CardModel({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      likes: entity.likes,
      tier: entity.tier ? CardTier.fromEntity(entity.tier) : null,
      thumbnail: entity.thumbnail?.length
        ? entity.thumbnail.map(Thumbnail.fromEntity)
        : null,
    });
  }
}

class CardValueTrade {
  constructor(
    public deckId: number,
    public cardListIds: number[],
    public value = 0,
  ) {}
}

export { CardModel, CardTier, Thumbnail, CARD_TIER, CardValueTrade };
