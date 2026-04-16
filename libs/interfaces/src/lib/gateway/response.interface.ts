import { HttpMessage } from '@common/constants';
import { HttpStatus } from '@nestjs/common';
export class Response<T> {
  code: string;
  statusCode: number;
  data?: T;
  error?: string;

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

  // static fail<T>(error: string, statusCode = HttpStatus.BAD_REQUEST): Response<T> {
  //   return new Response<T>({
  //     code: HttpMessage.BAD_REQUEST,
  //     statusCode,
  //     error,
  //     data: null,
  //   });
  // }
}
export type ResponseType<T> = Response<T>;
