import { TcpLoggingInterceptor } from '@common/configraruration';
import { HttpMessage, TCP_REQUEST_MESSAGE } from '@common/constants';
import { RequestParams } from '@common/decorators';
import { CreateUserRequestDto, Response } from '@common/interfaces';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserService } from '../service/user.service';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.USER.CREATE)
  async create(@RequestParams() body: CreateUserRequestDto): Promise<Response<string>> {
    await this.userService.create(body);
    return Response.success<string>(HttpMessage.CREATED);
  }
}
