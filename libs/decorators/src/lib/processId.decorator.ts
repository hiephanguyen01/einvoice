import { MetaDataKey } from '@common/constants';
import { getProcessId } from '@common/utils';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ProcessId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request[MetaDataKey.PROCESS_ID] || getProcessId();
});
