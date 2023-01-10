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

export { ThumbnailInputDto };
