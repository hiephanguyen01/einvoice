import { TcpLoggingInterceptor } from '@common/configraruration';
import { TCP_REQUEST_MESSAGE } from '@common/constants';
import { RequestParams } from '@common/decorators';
import { CreateKeycloakUserTcpReq, Response } from '@common/interfaces';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { KeycloakHttpService } from '../services/keycloak-http.service';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class KeycloakController {
  constructor(private readonly keycloakHttpService: KeycloakHttpService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.KEYCLOAK.CREATE_USER)
  async createUser(@RequestParams() body: CreateKeycloakUserTcpReq): Promise<Response<string>> {
    const userId = await this.keycloakHttpService.createUser(body);
    return Response.success<string>(userId);
  }
}
