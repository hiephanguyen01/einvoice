import { MetaDataKey } from '@common/constants';
import { AuthorizeResponse } from '@common/interfaces';
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const UserData = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  const userData = request[MetaDataKey.USER_DATA] as AuthorizeResponse;
  if (!userData) {
    throw new UnauthorizedException('User data not found in request');
  }
  return userData?.metadata;
});
