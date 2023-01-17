import { CardModel } from 'src/modules/card/services/card.model';
import { DeckModel } from 'src/modules/deck/services/deck.model';
import { UserModel } from '../../user/services/user.model';
import StoreEntity from '../entities/store.entity';

class StoreModel {
  constructor(model: Partial<StoreModel>) {
    Object.assign(this, model);
  }

  public id: number;
  public price: number;
  public user: Partial<UserModel>;
  public deck: Partial<DeckModel>;
  public card: Partial<CardModel>;

  static fromEntity(entity: StoreEntity): StoreModel {
    return new StoreModel({
      id: entity.id,
      price: entity.price,
      user: entity.user ? UserModel.fromEntity(entity.user) : null,
      card: entity.card ? CardModel.fromEntity(entity.card) : null,
    });
  }
}

export { StoreModel };
