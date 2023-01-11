import DeckEntity from '../entities/deck.entity';
class IncreaseCoinsParams {
  constructor(public deckId: number, public coinsValue: number) {}
}
class DeckModel {
  constructor(model: DeckModel) {
    Object.assign(this, model);
  }

  public id: number;
  public coins: number;
  public deckAmount: number;
  public claims: number;
  public gambles: number;
  public nextGamble?: Date;
  public nextDaily?: Date;

  static fromEntity(entity: DeckEntity) {
    return new DeckModel({
      id: entity.id,
      coins: entity.coins,
      deckAmount: entity.deckAmount,
      claims: entity.claims,
      gambles: entity.gambles,
      nextGamble: entity.nextGamble,
      nextDaily: entity.nextDaily,
    });
  }
}

export { IncreaseCoinsParams, DeckModel };
