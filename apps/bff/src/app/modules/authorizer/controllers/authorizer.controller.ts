import { TCP_SERVICES, TcpLoggingInterceptor } from '@common/configraruration';
import { TCP_REQUEST_MESSAGE } from '@common/constants';
import { Authorization, ProcessId } from '@common/decorators';
import { LoginRequestDto, LoginResponseDto, ResponseDto, TcpClient } from '@common/interfaces';
import { Body, Controller, Inject, Post, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { map } from 'rxjs/internal/operators/map';
@ApiTags('Authorizer')
@Controller('authorizer')
@UseInterceptors(TcpLoggingInterceptor)
export class AuthorizerController {
  constructor(@Inject(TCP_SERVICES.AUTHORIZE_SERVICE) private readonly authorizerClient: TcpClient) {}

  @Post('login')
  @ApiOkResponse({ type: ResponseDto<LoginResponseDto> })
  @ApiOperation({ summary: 'Login and get access token' })
  @Authorization({ secured: false })
  async login(@Body() body: LoginRequestDto, @ProcessId() processId: string) {
    return this.authorizerClient
      .send<LoginResponseDto, LoginRequestDto>(TCP_REQUEST_MESSAGE.AUTHORIZER.LOGIN, { data: body, processId })
      .pipe(map((data) => new ResponseDto(data)));
  }
}
