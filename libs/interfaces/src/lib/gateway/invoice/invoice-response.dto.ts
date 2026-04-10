import { INVOICE_STATUS } from '@common/constants';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from '../common/base-response.dto';
class ClientResponseDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  address: string;
}
class ItemResponseDto {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  vatRate: number;

  @ApiProperty()
  total: number;
}

export class InvoiceResponseDto extends BaseResponseDto {
  @ApiProperty({ type: ClientResponseDto })
  client: ClientResponseDto;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  vatAmount: number;

  @ApiProperty({ type: String, enum: INVOICE_STATUS })
  status: INVOICE_STATUS;

  @ApiProperty({ type: [ItemResponseDto] })
  item: ItemResponseDto[];

  @ApiProperty({ required: false })
  superVisorId?: string;

  @ApiProperty({ required: false })
  fileUrl?: string;
}
