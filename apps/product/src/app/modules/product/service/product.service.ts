import { CreateProductRequestDto } from '@common/interfaces';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}
  async create(data: CreateProductRequestDto) {
    const { name, sku } = data;
    const exists = await this.productRepository.exists(sku, name);
    if (exists) {
      throw new BadRequestException('Product with the same SKU or name already exists');
    }
    return this.productRepository.create(data);
  }

  getAll() {
    return this.productRepository.findAll();
  }
}
