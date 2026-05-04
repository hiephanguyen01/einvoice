import { User } from '@common/schemas';
import { Observable } from 'rxjs';
import { ResponseGRPC } from '../common/response.interface';

export interface UserById {
  userId: string;
  processId: string;
}

export interface UserAccessService {
  getByUserId(params: UserById): Observable<ResponseGRPC<User>>;
}
