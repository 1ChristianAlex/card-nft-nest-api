import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
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

class CardInputDto extends CardSimpleInputDto {
  constructor(body: CardInputDto) {
    super(body);
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

export { CardSimpleInputDto, CardInputDto };
