import { TCP_SERVICES } from '@common/configraruration';
import { ErrorCode, TCP_REQUEST_MESSAGE } from '@common/constants';
import { CreateKeycloakUserTcpReq, CreateUserRequestDto, ResponseType, TcpClient } from '@common/interfaces';
import { ConflictException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { createUserRequestMapping } from '../mappers';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(TCP_SERVICES.AUTHORIZE_SERVICE) private readonly authorizerClient: TcpClient,
  ) {}

  async create(params: CreateUserRequestDto, processId: string) {
    const isExxists = await this.userRepository.exists(params.email);
    if (isExxists) {
      throw new ConflictException(ErrorCode.USER_ALREADY_EXISTS);
    }

    const userId = await this.createKeycloakUser(
      {
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
        password: params.password,
      },
      processId,
    );

    const input = createUserRequestMapping(params, userId);
    const user = await this.userRepository.create(input);
    return user;
  }

  createKeycloakUser(data: CreateKeycloakUserTcpReq, processId: string): Promise<string> {
    return firstValueFrom(
      this.authorizerClient
        .send<string, CreateKeycloakUserTcpReq>(TCP_REQUEST_MESSAGE.KEYCLOAK.CREATE_USER, {
          data,
          processId,
        })
        .pipe(
          map((response: ResponseType<string>) => {
            if (!response.data) {
              throw new InternalServerErrorException('Missing user id from authorizer response');
            }
            return response.data;
          }),
        ),
    );
  }
}
