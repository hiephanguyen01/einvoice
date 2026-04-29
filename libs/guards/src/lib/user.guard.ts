import { TCP_SERVICES } from '@common/configraruration';
import { MetaDataKey, TCP_REQUEST_MESSAGE } from '@common/constants';
import { AuthorizeResponse, TcpClient } from '@common/interfaces';
import { getAccessToken, setUserData } from '@common/utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CanActivate, ExecutionContext, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import { Request } from 'express';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class UserGuard implements CanActivate {
  private readonly logger = new Logger(UserGuard.name);

  constructor(
    private readonly reflector: Reflector,
    @Inject(TCP_SERVICES.AUTHORIZE_SERVICE)
    private readonly authorizerClient: TcpClient,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
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

      const cacheKey = this.generateTokenCacheKey(token);
      const processId = req[MetaDataKey.PROCESS_ID] || '';

      const cachedResponse = await this.cacheManager.get<AuthorizeResponse>(cacheKey);
      if (cachedResponse) {
        setUserData(req, cachedResponse);
        return true;
      }

      const response = await this.verifyUserToken(token, processId);

      if (!response?.valid) {
        throw new UnauthorizedException('Token is invalid');
      }

      this.logger.debug(`Token verified successfully for cacheKey: ${cacheKey}`);

      setUserData(req, response);
      await this.cacheManager.set(cacheKey, response, 30 * 60 * 1000); // Cache for 30 minutes

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

  generateTokenCacheKey(token: string): string {
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    return `user_token:${hash}`;
  }
}
