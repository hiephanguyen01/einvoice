import { ErrorCode } from '@common/constants';
import { CreateUserRequestDto } from '@common/interfaces';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { createUserRequestMapping } from '../mappers';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(params: CreateUserRequestDto) {
    const isExxists = await this.userRepository.exists(params.email);
    if (isExxists) {
      throw new BadGatewayException(ErrorCode.USER_ALREADY_EXISTS);
    }
    const input = createUserRequestMapping(params);
    const user = await this.userRepository.create(input);
    return user;
  }
}
