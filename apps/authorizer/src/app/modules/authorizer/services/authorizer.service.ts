import { TCP_SERVICES } from '@common/configraruration';
import { TCP_REQUEST_MESSAGE } from '@common/constants';
import { LoginTcpRequest, TcpClient } from '@common/interfaces';
import { Role, User } from '@common/schemas';
import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { firstValueFrom, map } from 'rxjs';
import { KeycloakHttpService } from '../../keycloak/services/keycloak-http.service';
@Injectable()
export class AuthorizerService {
  private readonly logger = new Logger(AuthorizerService.name);
  private jwksClient: JwksClient;

  constructor(
    private readonly keycloakHttpService: KeycloakHttpService,
    private readonly configService: ConfigService,
    @Inject(TCP_SERVICES.USER_ACCESS_SERVICE) private readonly userAccessClient: TcpClient,
  ) {
    const host = this.configService.get<string>('KEYCLOAK_CONFIG.HOST') || '';
    const realm = this.configService.get<string>('KEYCLOAK_CONFIG.REALM') || '';
    const normalizedHost = host.startsWith('http://') || host.startsWith('https://') ? host : `http://${host}`;
    const jwksUri = `${normalizedHost.replace(/\/+$/, '')}/realms/${realm}/protocol/openid-connect/certs`;

    this.jwksClient = new JwksClient({
      jwksUri,
      cache: true,
      rateLimit: true,
    });
  }

  async login(params: LoginTcpRequest) {
    const { username, password } = params;
    const { access_token, refresh_token } = await this.keycloakHttpService.exchangeUserToken({ username, password });
    return {
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  }

  async verifyUserToken(token: string, ProcessId: string) {
    const tokenValue = token?.includes(' ') ? token.split(' ')[1] : token;
    const decoded = jwt.decode(tokenValue, { complete: true });
    if (!decoded || !decoded.header || !decoded.header.kid) {
      throw new UnauthorizedException('Invalid token structure');
    }

    try {
      const key = await this.jwksClient.getSigningKey(decoded.header.kid);
      const publicKey = key.getPublicKey();
      const payload = jwt.verify(tokenValue, publicKey, { algorithms: ['RS256'], clockTolerance: 30 }) as JwtPayload;
      console.log("🚀 ~ AuthorizerService ~ verifyUserToken ~ payload:", payload)

      const user = await this.validationUser(payload.sub as string, ProcessId);

      return {
        valid: true,
        metadata: {
          jwt: payload,
          permissions: (user.roles as unknown as Role[]).map((role) => role.permissions).flat(),
          user,
          userId: undefined,
        },
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        this.logger.error('Verify user token failed', error);
        throw new UnauthorizedException('Token expired');
      }

      if (error instanceof jwt.NotBeforeError) {
        this.logger.error('Verify user token failed', error);
        throw new UnauthorizedException('Token not active yet');
      }

      if (error instanceof UnauthorizedException) {
        this.logger.error('Verify user token failed', error);
        throw error;
      }

      this.logger.error('Verify user token failed', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
  private async validationUser(userId: string, processId: string) {
    const user = await this.getUserByUserId(userId, processId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  private getUserByUserId(userId: string, processId: string) {
    return firstValueFrom(
      this.userAccessClient
        .send<User, string>(TCP_REQUEST_MESSAGE.USER.GET_BY_USERID, {
          data: userId,
          processId,
        })
        .pipe(map((data) => data.data)),
    );
  }
}
