import { TCP_SERVICES } from '@common/configraruration';
import { MetaDataKey, TCP_REQUEST_MESSAGE } from '@common/constants';
import { AuthorizeResponse, TcpClient } from '@common/interfaces';
import { getAccessToken } from '@common/utils';
import { CanActivate, ExecutionContext, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { firstValueFrom, map, Observable } from 'rxjs';

@Injectable()
export class UserGuard implements CanActivate {
  private readonly logger = new Logger(UserGuard.name);
  constructor(
    private readonly reflector: Reflector,
    @Inject(TCP_SERVICES.AUTHORIZE_SERVICE) private readonly authorizerClient: TcpClient,
  ) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const authOptions = this.reflector.get<{ secured: boolean }>(MetaDataKey.SECURED, context.getHandler());

    if (authOptions?.secured) {
      return false;
    }

    return this.verifyToken(context.switchToHttp().getRequest());
  }

  private async verifyToken(req: any): Promise<boolean> {
    try {
      const token = getAccessToken(req);
      const processId = req[MetaDataKey.PROCESS_ID];
      const response = await this.verifyUserToken(token, processId);
      if (!response?.valid) {
        throw new UnauthorizedException('Token is invalid');
      }
      return true;
    } catch (error) {
      this.logger.error({ error });
      throw new UnauthorizedException('Token is invalid');
    }
  }

  private verifyUserToken(token: string, processId: string) {
    return firstValueFrom(
      this.authorizerClient
        .send<AuthorizeResponse, string>(TCP_REQUEST_MESSAGE.AUTHORIZER.VERIFY_TOKEN, {
          data: token,
          processId,
        })
        .pipe(map((response) => response.data)),
    );
  }
}
