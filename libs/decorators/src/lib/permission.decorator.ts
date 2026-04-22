import { PERMISSION } from '@common/constants';
import { Reflector } from '@nestjs/core';
export const Permissions = Reflector.createDecorator<PERMISSION[]>()