import { BaseEntity } from './base.entity';
import { Column, Entity } from 'typeorm';

@Entity('products')
export class Product extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  sku: string;

  @Column({ type: 'varchar', length: 50 })
  unit: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 , default: 0})
  price: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  vatRate: number;
}
