import { HttpMessage } from '@common/constants';
import { CallHandler, ExecutionContext, HttpStatus, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { inspect } from 'node:util';
import { catchError, Observable, tap } from 'rxjs';
@Injectable()
export class TcpLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();
    const handler = context.getHandler();
    const handlerName = handler.name;

    const args = context.getArgs();
    const param = args[0];
    const processId = param.processId;
    const serializedParam = inspect(param, { depth: 4, breakLength: 120 });

    Logger.log(
      `TCP >> Start process '${processId}' >> method: '${handlerName}' at '${now}' >> param: ${serializedParam}`,
    );

    return next.handle().pipe(
      tap(() =>
        Logger.log(`TCP >> End process '${processId}' >> method: '${handlerName}' after: '${Date.now() - now}ms'`),
      ),
      catchError((error) => {
        Logger.error(
          `TCP >> Error process '${processId}' >> method: '${handlerName}' after: '${Date.now() - now}ms'`,
          error.stack,
        );
        throw new RpcException({
          code: error?.status || error?.code || error?.response?.code || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error?.response?.message || error?.message || HttpMessage.INTERNAL_SERVER_ERROR,
        });
      }),
    );
  }
}
