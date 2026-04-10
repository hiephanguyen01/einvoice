import { TcpLoggingInterceptor } from '@common/configraruration';
import { TCP_REQUEST_MESSAGE } from '@common/constants';
import { RequestParams } from '@common/decorators';
import { CreateInvoiceTcpRequest, InvoiceTcpResponse, Response } from '@common/interfaces';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InvoiceService } from '../service/invoice.service';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.INVOICE.CREATE)
  async create(@RequestParams() params: CreateInvoiceTcpRequest): Promise<Response<InvoiceTcpResponse>> {
    const result = await this.invoiceService.create(params);
    return Response.success<InvoiceTcpResponse>(result);
  }
}
