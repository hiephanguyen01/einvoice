import { ErrorCode } from '@common/constants';
import { CreateKeycloakUserRequest, ExchangeClientTokenResponse } from '@common/interfaces';
import { ConflictException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class KeycloakHttpService {
  private readonly logger = new Logger(KeycloakHttpService.name);
  private readonly axiosInstance: AxiosInstance;
  private realm: string;
  private clientId: string;
  private clientSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.axiosInstance = axios.create({
      baseURL: this.configService.get<string>('KEYCLOAK_CONFIG.HOST'),
    });

    this.realm = this.configService.get<string>('KEYCLOAK_CONFIG.REALM') || '';
    this.clientId = this.configService.get<string>('KEYCLOAK_CONFIG.CLIENT_ID') || '';
    this.clientSecret = this.configService.get<string>('KEYCLOAK_CONFIG.CLIENT_SECRET') || '';
  }

  async exchangeClientToken(): Promise<ExchangeClientTokenResponse> {
    const body = new URLSearchParams();
    body.append('grant_type', 'client_credentials');
    body.append('client_id', this.clientId);
    body.append('client_secret', this.clientSecret);
    body.append('scope', 'openid');

    const { data } = await this.axiosInstance.post(`/realms/${this.realm}/protocol/openid-connect/token`, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return data;
  }

  async createUser(data: CreateKeycloakUserRequest): Promise<string> {
    const { email, firstName, lastName, password } = data;
    const { access_token } = await this.exchangeClientToken();
    try {
      const { headers } = await this.axiosInstance.post(
        `/admin/realms/${this.realm}/users`,
        {
          username: email,
          email,
          firstName,
          lastName,
          enabled: true,
          emailVerified: true,
          credentials: [
            {
              type: 'password',
              value: password,
              temporary: false,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      const locationHeader = headers['location'];
      const userId = locationHeader?.split('/').pop();
      if (!userId) {
        throw new InternalServerErrorException('Failed to create user in Keycloak');
      }

      this.logger.log(`Created user ${email} in Keycloak with ID ${userId}`);
      return userId;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        throw new ConflictException(ErrorCode.USER_ALREADY_EXISTS);
      }
      throw error;
    }
  }
}
