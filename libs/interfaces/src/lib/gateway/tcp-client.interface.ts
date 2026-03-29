import { Observable } from 'rxjs';
import { RequestType } from './request.interface';
import { ResponseType } from './response.interface';

export interface TcpClient {
  send<T, R>(pattern: string, data: RequestType<R>): Observable<ResponseType<T>>;
  emit<T>(pattern: string, data: RequestType<T>): Observable<ResponseType<T>>;
}
