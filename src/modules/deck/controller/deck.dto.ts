import { IsNumber, IsArray, IsNotEmpty, IsObject } from 'class-validator';

class DeckTradeItemInputDto {
  @IsNumber()
  public deckId: number;

  @IsArray()
  public cardIds: number[];

  @IsNumber()
  public value: number;
}

class DeckTradeInputDto {
  @IsObject()
  self: DeckTradeItemInputDto;

  @IsObject()
  target: DeckTradeItemInputDto;
}

class CardClaimInputDto {
  @IsNumber()
  @IsNotEmpty()
  public id: number;
}

class AcceptTradeTransactionInputDto {
  @IsNumber()
  @IsNotEmpty()
  public id: number;
}

export {
  DeckTradeInputDto,
  DeckTradeItemInputDto,
  CardClaimInputDto,
  AcceptTradeTransactionInputDto,
};
