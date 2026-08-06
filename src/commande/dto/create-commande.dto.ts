import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CommandeItemDto {
  @IsInt()
  productId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateCommandeDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CommandeItemDto)
  items: CommandeItemDto[];
}
