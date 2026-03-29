import { ProcessId } from '@common/decorators';
import { ResponseDto, TcpClient } from '@common/interfaces';
import { Controller, Get, Inject } from '@nestjs/common';
import { map } from 'rxjs/internal/operators/map';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Inject('TCP_INVOICE_SERVICE') private readonly invoiceClient: TcpClient;

  @Get()
  getData() {
    const result = this.appService.getData();
    return new ResponseDto({ data: result });
  }

  @Get('invoice')
  async getInvoiceData(@ProcessId() processId: string) {
    return this.invoiceClient
      .send<string, { invoiceId: string; invoiceName: string }>('get-invoice', {
        processId,
        data: {
          invoiceId: '123',
          invoiceName: 'Invoice 123',
        },
      })
      .pipe(map((response) => new ResponseDto({ data: response })));
  }
}
