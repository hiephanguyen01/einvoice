import { HttpMessage } from '@common/constants';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
export class ResponseDto<T> {
  @ApiProperty({ type: String })
  message = HttpMessage.OK;

  @ApiProperty({ type: Number })
  statusCode = HttpStatus.OK;

  @ApiProperty({ type: String, required: false })
  processId?: string;

  @ApiProperty({ type: Object, required: false })
  data?: T;

  @ApiProperty({ type: Number, required: false })
  duration?: number;

  constructor(data: Partial<ResponseDto<T>>) {
    Object.assign(this, data);
  }
}
