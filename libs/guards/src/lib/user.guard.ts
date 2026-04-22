import { TCP_SERVICES } from '@common/configraruration';
import { MetaDataKey, TCP_REQUEST_MESSAGE } from '@common/constants';
import { AuthorizeResponse, TcpClient } from '@common/interfaces';
import { getAccessToken, setUserData } from '@common/utils';
import { CanActivate, ExecutionContext, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class UserGuard implements CanActivate {
  private readonly logger = new Logger(UserGuard.name);

  constructor(
    private readonly reflector: Reflector,
    @Inject(TCP_SERVICES.AUTHORIZE_SERVICE)
    private readonly authorizerClient: TcpClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authOptions = this.reflector.getAllAndOverride<{ secured: boolean }>(MetaDataKey.SECURED, [
      context.getHandler(),
      context.getClass(),
    ]);

    // ❌ Bug cũ: secured = true thì return false
    // ✅ Fix: nếu KHÔNG secured thì cho qua
    if (!authOptions?.secured) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request & { [MetaDataKey.PROCESS_ID]?: string }>();
    return this.verifyToken(request);
  }

  private async verifyToken(req: Request & { [MetaDataKey.PROCESS_ID]?: string }): Promise<boolean> {
    try {
      const token = getAccessToken(req);

      if (!token) {
        throw new UnauthorizedException('Missing token');
      }

      const processId = req[MetaDataKey.PROCESS_ID] || '';

      const response = await this.verifyUserToken(token, processId);
      console.log("🚀 ~ UserGuard ~ verifyToken ~ response:", response)

      if (!response?.valid) {
        throw new UnauthorizedException('Token is invalid');
      }

      setUserData(req,response);
      return true;
    } catch (error) {
      this.logger.error('Verify token failed', error);

      const message =
        (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string'
          ? error.message
          : undefined) || 'Token is invalid';

      throw new UnauthorizedException(message);
    }
  }

  private async verifyUserToken(token: string, processId: string) {
    return firstValueFrom(
      this.authorizerClient
        .send<AuthorizeResponse, string>(TCP_REQUEST_MESSAGE.AUTHORIZER.VERIFY_USER_TOKEN, {
          data: token,
          processId,
        })
        .pipe(map((response) => response.data)),
    );
  }
}
