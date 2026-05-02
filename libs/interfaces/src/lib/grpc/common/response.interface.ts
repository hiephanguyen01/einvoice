import { HttpMessage } from '@common/constants';
import { HttpStatus } from '@nestjs/common';

export class ResponseGRPC<T> {
  code = HttpMessage.OK;
  data?: T;
  error = '';
  statusCode?: number;

  constructor(data: Partial<ResponseGRPC<T>>) {
    this.code = data.code || HttpMessage.OK;
    this.data = data.data;
    this.error = data.error || '';
    this.statusCode = data.statusCode;
  }
  static success<T>(data?: T): ResponseGRPC<T> {
    return new ResponseGRPC<T>({
      code: HttpMessage.OK,
      data,
      error: '',
      statusCode: HttpStatus.OK,
    });
  }
}
export type ResponseGRPCType<T> = ResponseGRPC<T>;
