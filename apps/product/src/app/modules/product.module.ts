import { TypeOrmProvider } from '@common/configraruration';
import { Product } from '@common/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product/controllers/product.controller';
import { ProductRepository } from './product/repositories/product.repository';
import { ProductService } from './product/service/product.service';

@Module({
  imports: [TypeOrmProvider, TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [],
})
export class ProductModule {}
