import { UnauthorizedException } from '@nestjs/common';
import { v4 } from 'uuid';

export const getProcessId = (prefix?: string): string => {
  return prefix ? `${prefix}-${v4()}` : `${v4()}`;
};

export function parseToken(token: string) {
  if (!token?.trim()) {
    throw new UnauthorizedException('Invalid token');
  }
  if (token.includes(' ')) {
    return token.split(' ')[1];
  }
  return token;
}
