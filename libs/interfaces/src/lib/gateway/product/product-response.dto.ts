import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityResponseDto } from '../common/base-entity-response.dto';
export class ProductResponseDto extends BaseEntityResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  sku: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  vatRate: number;

  @ApiProperty()
  unit: string;
}
