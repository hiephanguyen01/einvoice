import { PORT } from '@common/constants';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getData(): { message: string } {
    console.log('first', PORT);
    return { message: 'Hello API' };
  }
}
