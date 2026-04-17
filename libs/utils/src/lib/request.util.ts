import { parseToken } from './string.util';

export function getAccessToken(req: any, keepBearer = false) {
  const token = req.headers?.authorization || req.headers?.Authorization;
  return keepBearer ? token : parseToken(token);
}
