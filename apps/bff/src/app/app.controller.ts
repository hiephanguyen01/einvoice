import { ResponseDto } from '@common/interfaces';
import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Inject('TCP_INVOICE_SERVICE') private readonly invoiceClient: ClientProxy;

  @Get()
  getData() {
    const result = this.appService.getData();
    return new ResponseDto({ data: result });
  }

  @Get('invoice')
  async getInvoiceData() {
    const result = await firstValueFrom(this.invoiceClient.send<string, number>('get-invoice-data', 1));
    return new ResponseDto({ data: result });
  }
}
