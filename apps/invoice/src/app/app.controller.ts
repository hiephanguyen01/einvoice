import { TcpLoggingInterceptor } from '@common/configraruration';
import { ProcessId, RequestParams } from '@common/decorators';
import { Response } from '@common/interfaces';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }
  @MessagePattern('get-invoice')
  getInvoiceData(
    @ProcessId() processId: string,
    @RequestParams() params: { invoiceId: string; invoiceName: string },
    @RequestParams('invoiceId') invoiceId: string,
  ): Response<string> {
    return Response.success<string>(`Invoice data: ${invoiceId}`);
  }
}
