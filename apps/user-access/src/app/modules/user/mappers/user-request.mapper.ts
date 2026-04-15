import { CreateUserRequestDto } from '@common/interfaces';
import { Types } from 'mongoose';

export const createUserRequestMapping = (data: CreateUserRequestDto) => {
  return {
    ...data,
    roles: data.roles.map((role) => new Types.ObjectId(role)),
  };
};
