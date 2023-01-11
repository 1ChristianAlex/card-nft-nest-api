import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

class ThumbnailInputDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(240)
  public description: string;

  @IsNotEmpty()
  @IsString()
  public cardId: string;
}

class ThumbnailPositionInputDto {
  @IsNotEmpty()
  @IsNumber()
  public thumbId: number;

  @IsNotEmpty()
  @IsNumber()
  public position: number;
}

export { ThumbnailInputDto, ThumbnailPositionInputDto };
