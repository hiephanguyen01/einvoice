import { getProcessId } from '@common/utils';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const processId = getProcessId('req');

    console.log(`Request: ${method} ${originalUrl}, Process ID:   ${processId}`);
    next();
  }
}
