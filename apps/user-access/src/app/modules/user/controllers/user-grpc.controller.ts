import { ResponseGRPC, UserById } from '@common/interfaces';
import { User } from '@common/schemas';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UserService } from '../service/user.service';

@Controller()
export class UserGrpcController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserAccessService', 'getByUserId')
  async getByUserId(data: UserById): Promise<ResponseGRPC<User | null>> {
    console.log("🚀 ~ UserGrpcController ~ getByUserId ~ data:", data)
    const user = await this.userService.getUserByUserId(data.userId);
    return ResponseGRPC.success<User | null>(user);
  }
}
