import { Observable } from 'rxjs';
import { RequestType } from './request.interface';
import { ResponseType } from './response.interface';
export interface TcpClient {
  send<Response, Request>(pattern: string, data: RequestType<Request>): Observable<ResponseType<Response>>;

  emit<Request>(pattern: string, data: RequestType<Request>): Observable<void>;
}
