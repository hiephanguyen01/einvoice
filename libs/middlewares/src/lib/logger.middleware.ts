import { MetaDataKey } from '@common/constants';
import { getProcessId } from '@common/utils';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const processId = getProcessId('req');
    (req as any)[MetaDataKey.PROCESS_ID] = processId;

    const originalSend = res.send.bind(res);
    res.send = (body?: any): Response => {
      return originalSend(body);
    };

    next();
  }
}
