import { TCP_SERVICES } from '@common/configraruration';
import { TCP_REQUEST_MESSAGE } from '@common/constants';
import { Authorization, ProcessId } from '@common/decorators';
import { CreateUserRequestDto, ResponseDto, TcpClient, UserResponseDto } from '@common/interfaces';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { map } from 'rxjs/internal/operators/map';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(@Inject(TCP_SERVICES.USER_ACCESS_SERVICE) private readonly userClient: TcpClient) {}

  @Post()
  @ApiOkResponse({ type: ResponseDto<string> })
  @ApiOperation({ summary: 'Create a new user' })
  @Authorization({ secured: false })
  create(@Body() body: CreateUserRequestDto, @ProcessId() processId: string) {
    return this.userClient
      .send<UserResponseDto, CreateUserRequestDto>(TCP_REQUEST_MESSAGE.USER.CREATE, {
        data: body,
        processId,
      })
      .pipe(map((data) => new ResponseDto({ data })));
  }
}
