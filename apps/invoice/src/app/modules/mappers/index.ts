import { CreateInvoiceTcpRequest } from '@common/interfaces';

export const invoiceRequestMapping = (data: CreateInvoiceTcpRequest) => {
  return {
    ...data,
    totalAmount: data.item.reduce((total, item) => total + item.total, 0),
    vatAmount: data.item.reduce((total, item) => total + (item.unitPrice * item.quantity * (item.vatRate / 100)), 0),
  };
};
