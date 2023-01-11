import DeckEntity from '../entities/deck.entity';
class IncreaseWalletParams {
  constructor(public deckId: number, public walletValue: number) {}
}
class DeckModel {
  constructor(model: DeckModel) {
    Object.assign(this, model);
  }

  public id: number;
  public wallet: number;
  public deckAmount: number;
  public claims: number;
  public gambles: number;
  public nextGamble?: Date;
  public nextDaily?: Date;

  static fromEntity(entity: DeckEntity) {
    return new DeckModel({
      id: entity.id,
      wallet: entity.wallet,
      deckAmount: entity.deckAmount,
      claims: entity.claims,
      gambles: entity.gambles,
      nextGamble: entity.nextGamble,
      nextDaily: entity.nextDaily,
    });
  }
}

export { IncreaseWalletParams, DeckModel };
