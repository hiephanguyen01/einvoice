import { TCP_SERVICES } from '@common/configraruration';
import { PERMISSION, TCP_REQUEST_MESSAGE } from '@common/constants';
import { Authorization, Permissions, ProcessId, UserData } from '@common/decorators';
import {
  AuthorizerMetadata,
  CreateInvoiceTcpRequest,
  InvoiceRequestDto,
  InvoiceResponseDto,
  InvoiceTcpResponse,
  ResponseDto,
  TcpClient,
} from '@common/interfaces';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { map } from 'rxjs/internal/operators/map';

@ApiTags('Invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(@Inject(TCP_SERVICES.INVOICE_SERVICE) private readonly invoiceClient: TcpClient) {}
  @Post()
  @ApiResponse({ type: ResponseDto<InvoiceResponseDto> })
  @ApiOperation({ summary: 'Create a new invoice' })
  @Authorization({ secured: true })
  @Permissions([PERMISSION.INVOICE_CREATE, PERMISSION.INVOICE_GET_BY_ID])
  create(@Body() body: InvoiceRequestDto, @ProcessId() processId: string, @UserData() userData: AuthorizerMetadata) {
    console.log('🚀 ~ InvoiceController ~ create ~ body:', userData);
    return this.invoiceClient
      .send<InvoiceTcpResponse, CreateInvoiceTcpRequest>(TCP_REQUEST_MESSAGE.INVOICE.CREATE, {
        data: body,
        processId,
      })
      .pipe(map((data) => new ResponseDto({ data })));
  }
}
