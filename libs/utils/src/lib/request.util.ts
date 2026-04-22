import { MetaDataKey } from '@common/constants';
import { parseToken } from './string.util';

export function getAccessToken(req: any, keepBearer = false) {
  const token = req.headers?.authorization || req.headers?.Authorization;
  return keepBearer ? token : parseToken(token);
}

export function setUserData(req: any, userData?: any) {
  req[MetaDataKey.USER_DATA] = userData;
}
