import { TcpLoggingInterceptor } from '@common/configraruration';
import { TCP_REQUEST_MESSAGE } from '@common/constants';
import { RequestParams } from '@common/decorators';
import { CreateProductRequestDto, ProductResponseDto, ProductTcpResponse, Response } from '@common/interfaces';
import { Controller, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ProductService } from '../service/product.service';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.PRODUCT.CREATE)
  async create(@RequestParams() body: CreateProductRequestDto): Promise<Response<ProductTcpResponse>> {
    const result = await this.productService.create(body);
    return Response.success<ProductTcpResponse>(result);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.PRODUCT.GET_ALL)
  async getAll(): Promise<Response<ProductTcpResponse[]>> { 
    const result = await this.productService.getAll();
    return Response.success<ProductTcpResponse[]>(result);
  }
}
