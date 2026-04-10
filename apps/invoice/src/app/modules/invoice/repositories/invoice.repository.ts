import { Invoice, InvoiceModel, InvoiceModelName } from '@common/schemas';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class InvoiceRepository {
  constructor(@InjectModel(InvoiceModelName) private readonly invoiceModel: InvoiceModel) {}

  create(data: Partial<Invoice>) {
    return this.invoiceModel.create(data);
  }
  getById(id: string) {
    return this.invoiceModel.findById(id).exec();
  }

  updateById(id: string, data: Partial<Invoice>) {
    return this.invoiceModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  deleteById(id: string) {
    return this.invoiceModel.findByIdAndDelete(id).exec();
  }


}
