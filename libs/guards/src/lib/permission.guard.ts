import { MetaDataKey, PERMISSION } from '@common/constants';
import { Permissions } from '@common/decorators';
import { AuthorizeResponse } from '@common/interfaces';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<PERMISSION[]>(Permissions, context.getHandler());
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No permissions required, allow access
    }
    const request = context.switchToHttp().getRequest();
    const userPermissions = request[MetaDataKey.USER_DATA] as AuthorizeResponse | undefined;
    const userPermissionsList = userPermissions?.metadata?.permissions || [];
    const isValid = requiredPermissions.every((permission) => userPermissionsList.includes(permission));
    if (!isValid) {
      throw new UnauthorizedException('Permission denied');
    }

    return isValid;
  }
}
