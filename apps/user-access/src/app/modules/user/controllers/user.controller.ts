import { TcpLoggingInterceptor } from '@common/configraruration';
import { HttpMessage, TCP_REQUEST_MESSAGE } from '@common/constants';
import { ProcessId, RequestParams } from '@common/decorators';
import { CreateUserTcpRequest, Response } from '@common/interfaces';
import { User } from '@common/schemas';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from '../service/user.service';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.USER.CREATE)
  async create(@RequestParams() data: CreateUserTcpRequest, @ProcessId() processId: string): Promise<Response<string>> {
    await this.userService.create(data, processId);
    return Response.success<string>(HttpMessage.CREATED);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.USER.GET_BY_USERID)
  async getByUserId(@RequestParams() userId: string): Promise<Response<User | null>> {
    const user = await this.userService.getUserByUserId(userId);
    return Response.success<User | null>(user);
  }
}
