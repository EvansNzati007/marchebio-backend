import {
  IsString,
  IsNumber,
  Min,
  IsOptional,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

export class CreateProduitDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  quantity: number;

  @IsOptional()
  @IsString()
  photoData?: string; // Base64 complet

  @IsOptional()
  @IsString()
  photoMimeType?: string; // "image/jpeg", "image/png"
}
