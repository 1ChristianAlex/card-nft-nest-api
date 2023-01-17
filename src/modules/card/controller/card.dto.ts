import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { CardModel, CardTier, Thumbnail } from '../services/card.model';

class CardSimpleInputDto {
  constructor(body: CardSimpleInputDto) {
    Object.assign(this, body);
  }

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public description: string;

  @IsNotEmpty()
  @IsNumber()
  public price: number;

  static dtoToModel(input: CardSimpleInputDto): CardModel {
    return new CardModel({
      name: input.name,
      description: input.description,
      price: input.price,
      likes: null,
      id: null,
    });
  }
}

class CardInputDto {
  constructor(body: CardInputDto) {
    Object.assign(this, body);
  }

  @IsNumber()
  @IsNotEmpty()
  public id: number;

  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public description: string;

  @IsNotEmpty()
  @IsNumber()
  public price: number;

  public likes: number;

  public tier: number;
  public thumbnail: number[];

  static dtoToModel(input: CardInputDto): CardModel {
    return new CardModel({
      name: input.name,
      description: input.description,
      price: input.price,
      likes: input.likes,
      id: input.id,
      thumbnail: input.thumbnail?.map((item) => ({ id: item } as Thumbnail)),
      tier: { id: input.tier } as CardTier,
    });
  }
}

class CardUpdateInputDto extends CardInputDto {
  @IsString()
  @IsOptional()
  public declare name: string;

  @IsString()
  @IsOptional()
  public declare description: string;

  @IsOptional()
  @IsNumber()
  public declare price: number;
}

export { CardSimpleInputDto, CardInputDto, CardUpdateInputDto };
