import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
@Injectable()
export class AuthorizerService {
  private readonly logger = new Logger(AuthorizerService.name);
  private jwksClient: JwksClient;
  constructor(private readonly keycloakHttpService: any, private readonly configService: ConfigService) {
    const host = this.configService.get<string>('KEYCLOAK_HOST');
    const realm = this.configService.get<string>('KEYCLOAK_REALM');
    this.jwksClient = new JwksClient({
      jwksUri: `http://${host}/realms/${realm}/protocol/openid-connect/certs`,
      cache: true,
      rateLimit: true,
    });
  }
  async login(params: any) {
    return {};
  }

  async verifyUserToken(token: string) {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded || !decoded.header || !decoded.header.kid) {
      throw new UnauthorizedException('Invalid token structure');
    }
    try {
      const key = await this.jwksClient.getSigningKey(decoded.header.kid);
      const publicKey = key.getPublicKey();
      const payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;
      return {
        valid: true,
        metadata: {
          jwt: payload,
          permissions: [],
          user: undefined,
          userId: undefined,
        },
      };
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
