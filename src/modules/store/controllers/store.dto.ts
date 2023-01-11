import { IsNotEmpty, IsNumber } from 'class-validator';

class StoreInputDto {
  @IsNotEmpty()
  @IsNumber()
  public cardId: number;

  @IsNotEmpty()
  @IsNumber()
  public marketPrice: number;
}

class StorePurchaseInputDto {
  @IsNotEmpty()
  @IsNumber()
  public storeId: number;
}

export { StoreInputDto, StorePurchaseInputDto };
