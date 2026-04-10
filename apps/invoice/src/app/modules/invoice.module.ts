import { MongoProvider } from '@common/configraruration';
import { InvoiceDestination } from '@common/schemas';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceController } from './invoice/controllers/invoice.controller';
import { InvoiceRepository } from './invoice/repositories/invoice.repository';
import { InvoiceService } from './invoice/service/invoice.service';

@Module({
  imports: [MongoProvider, MongooseModule.forFeature([InvoiceDestination])],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceRepository],
})
export class InvoiceModule {}
