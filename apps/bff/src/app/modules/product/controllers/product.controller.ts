import { TCP_SERVICES } from '@common/configraruration';
import { TCP_REQUEST_MESSAGE } from '@common/constants';
import { ProcessId } from '@common/decorators';
import { CreateProductRequestDto, ProductResponseDto, ResponseDto, TcpClient } from '@common/interfaces';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { map } from 'rxjs/internal/operators/map';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(@Inject(TCP_SERVICES.PRODUCT_SERVICE) private readonly productClient: TcpClient) {}
  @Post()
  @ApiResponse({ type: ResponseDto<ProductResponseDto> })
  @ApiOperation({ summary: 'Create a new product' })
  create(@Body() body: CreateProductRequestDto, @ProcessId() processId: string) {
    return this.productClient
      .send<ProductResponseDto, CreateProductRequestDto>(TCP_REQUEST_MESSAGE.PRODUCT.CREATE, {
        data: body,
        processId,
      })
      .pipe(map((data) => new ResponseDto({ data })));
  }

  @Get()
  @ApiResponse({ type: ResponseDto<ProductResponseDto[]> })
  @ApiOperation({ summary: 'Get all products' })
  getAll(@ProcessId() processId: string) {
    return this.productClient
      .send<ProductResponseDto[], void>(TCP_REQUEST_MESSAGE.PRODUCT.GET_ALL, {
        data: undefined,
        processId,
      })
      .pipe(map((data) => new ResponseDto({ data })));
  }
}
