import { CreateInvoiceTcpRequest } from '@common/interfaces';
import { Injectable, NotFoundException } from '@nestjs/common';
import { invoiceRequestMapping } from '../../mappers';
import { InvoiceRepository } from '../repositories/invoice.repository';

@Injectable()
export class InvoiceService {
  constructor(private readonly invoiceRepository: InvoiceRepository) {}

  create(params: CreateInvoiceTcpRequest) {
    const input = invoiceRequestMapping(params);
    return this.invoiceRepository.create(input);
  }

  async getById(id: string) {
    const invoice = await this.invoiceRepository.getById(id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with id '${id}' not found`);
    }

    return invoice;
  }
}
