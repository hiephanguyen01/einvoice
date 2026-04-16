import { CreateUserTcpRequest } from '@common/interfaces';
import { Types } from 'mongoose';

export const createUserRequestMapping = (data: CreateUserTcpRequest, userId: string) => {
  return {
    ...data,
    roles: data.roles?.map((roleId) => new Types.ObjectId(roleId)),
    userId,
  };
};
