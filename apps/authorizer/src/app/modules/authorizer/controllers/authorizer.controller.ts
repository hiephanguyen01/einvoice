import { TcpLoggingInterceptor } from '@common/configraruration';
import { TCP_REQUEST_MESSAGE } from '@common/constants';
import { ProcessId, RequestParams } from '@common/decorators';
import { AuthorizeResponse, LoginTcpRequest, LoginTcpResponse, Response } from '@common/interfaces';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthorizerService } from '../services/authorizer.service';
@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class AuthorizerController {
  constructor(private readonly authorizerService: AuthorizerService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.AUTHORIZER.LOGIN)
  async login(@RequestParams() params: LoginTcpRequest) {
    const result = await this.authorizerService.login(params);
    return Response.success<LoginTcpResponse>(result);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.AUTHORIZER.VERIFY_USER_TOKEN)
  async verifyUserToken(@RequestParams() token: string, @ProcessId() processId: string) {
    const result = await this.authorizerService.verifyUserToken(token, processId);
    return Response.success<AuthorizeResponse>(result);
  }
}
