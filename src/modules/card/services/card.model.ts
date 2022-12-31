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

  static entryToModel(entity: TierEntity): CardTier {
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

  static entryToModel(entity: ThumbsEntity): Thumbnail {
    return new Thumbnail({
      id: entity.id,
      description: entity.description,
      path: entity.path,
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

  static entryToModel(entity: CardEntity): CardModel {
    return new CardModel({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      price: entity.price,
      likes: entity.likes,
      tier: entity.tier ? CardTier.entryToModel(entity.tier) : null,
      thumbnail: entity.thumbnail
        ? entity.thumbnail.map(Thumbnail.entryToModel)
        : null,
    });
  }
}

export { CardModel, CardTier, Thumbnail, CARD_TIER };
