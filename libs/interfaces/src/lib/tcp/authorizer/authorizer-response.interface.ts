import { PERMISSION } from '@common/constants';
import { User } from '@common/schemas';
import { JwtPayload } from 'jsonwebtoken';

export class AuthorizerMetadata {
  userId: string | undefined;
  user: User | undefined;
  permissions: PERMISSION[] | undefined;
  jwt: JwtPayload | undefined;

  constructor(payload?: Partial<AuthorizerMetadata>) {
    Object.assign(this, payload);
  }
}

export class AuthorizeResponse {
  valid = false;
  metadata = new AuthorizerMetadata();

  constructor(payload?: Partial<AuthorizeResponse>) {
    Object.assign(this, payload);
  }
}
