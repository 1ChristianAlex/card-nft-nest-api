import { IsNumber, IsArray, IsNotEmpty } from 'class-validator';

class DeckTradeItemInputDto {
  @IsNumber()
  public userId: number;

  @IsArray()
  public cardIds: number[];

  @IsNumber()
  public value: number;
}

class DeckTradeInputDto {
  self: DeckTradeItemInputDto;
  target: DeckTradeItemInputDto;
}

class CardClaimInputDto {
  @IsNumber()
  @IsNotEmpty()
  public id: number;
}

export { DeckTradeInputDto, DeckTradeItemInputDto, CardClaimInputDto };
