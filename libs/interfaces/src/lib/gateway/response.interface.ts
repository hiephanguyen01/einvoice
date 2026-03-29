import { HttpMessage } from '@common/constants';
import { HttpStatus } from '@nestjs/common';

export class Response<T> {
  code: string;
  statusCode: number;
  error?: string;
  data?: T;

  constructor(data: Partial<Response<T>>) {
    this.code = data.code || HttpMessage.OK;
    this.statusCode = data.statusCode || HttpStatus.OK;
    this.data = data.data;
    this.error = data.error;
  }

  static success<T>(data: T): Response<T> {
    return new Response<T>({
      code: HttpMessage.OK,
      statusCode: HttpStatus.OK,
      data,
    });
  }
}

export type ResponseType<T> = Response<T> | T;
