import { ResponseGRPC, VerifyUserTokenRequest, VerifyUserTokenResponse } from '@common/interfaces';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AuthorizerService } from '../services/authorizer.service';

@Controller()
export class AuthorizerGrpcController {
  constructor(private readonly authorizerService: AuthorizerService) {}

  @GrpcMethod('AuthorizerService', 'verifyUserToken')
  async verifyUserToken(params: VerifyUserTokenRequest): Promise<VerifyUserTokenResponse> {
    const result = await this.authorizerService.verifyUserToken(params.token, params.processId);
    return ResponseGRPC.success(result);
  }
}
