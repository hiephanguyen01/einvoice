import { Product } from '@common/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductRepository {
  constructor(@InjectRepository(Product) private readonly productRepository: Repository<Product>) {}

  async create(productData: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(productData);
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findById(id: string): Promise<Product | null> {
    return (await this.productRepository.findOne({ where: { id } })) || null;
  }

  async update(id: string, updateData: Partial<Product>): Promise<Product | null> {
    await this.productRepository.update(id, updateData);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }

  async exists(sku: string, name: string): Promise<boolean> {
    return this.productRepository.exist({ where: { sku, name } });
  }
}
