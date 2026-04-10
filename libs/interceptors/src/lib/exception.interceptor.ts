import { HttpMessage, MetaDataKey } from '@common/constants';
import { ResponseDto } from '@common/interfaces';
import { CallHandler, ExecutionContext, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { catchError, map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

export class ExceptionInterceptor {
  private readonly logger = new Logger(ExceptionInterceptor.name);

  intercept(context: ExecutionContext, next:CallHandler): Observable<any>| Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request: Request & { [MetaDataKey.PROCESS_ID]: string } = ctx.getRequest();
    const processId = request[MetaDataKey.PROCESS_ID];
    return next.handle().pipe(
      map((data: ResponseDto<unknown>) => {
        data.processId = processId;

        return data;
      }),
      catchError((error) => {
        this.logger.error({ error });
        const message = error.message || error.response?.message || HttpMessage.INTERNAL_SERVER_ERROR;
        const statusCode = error.status || error.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
        throw new HttpException(new ResponseDto({ message, statusCode, processId }), statusCode);
      }),
    );
  }
}
