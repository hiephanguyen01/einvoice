import { GRPC_SERVICES } from '@common/configraruration';
import { MetaDataKey } from '@common/constants';
import { AuthorizeResponse, AuthorizerService } from '@common/interfaces';
import { getAccessToken, setUserData } from '@common/utils';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CanActivate, ExecutionContext, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientGrpc } from '@nestjs/microservices';
import { Cache } from 'cache-manager';
import * as crypto from 'crypto';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserGuard implements CanActivate {
  private readonly logger = new Logger(UserGuard.name);
  private authorizerService: AuthorizerService;

  constructor(
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    @Inject(GRPC_SERVICES.AUTHORIZER_SERVICE) private readonly grpcAuthorizerClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authorizerService = this.grpcAuthorizerClient.getService<AuthorizerService>('AuthorizerService');
  }

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

      const response = await firstValueFrom(this.authorizerService.verifyUserToken({ token, processId }));
      const { data: result } = response || {};

      if (!result?.valid) {
        throw new UnauthorizedException('Token is invalid');
      }

      setUserData(req, result);
      await this.cacheManager.set(cacheKey, result, 30 * 60 * 1000); // Cache for 30 minutes

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

  generateTokenCacheKey(token: string): string {
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    return `user_token:${hash}`;
  }
}
