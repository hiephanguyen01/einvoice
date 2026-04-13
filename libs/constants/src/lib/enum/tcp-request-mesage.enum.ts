enum INVOICE {
  CREATE = 'invoice.create',
  GET_BY_ID = 'invoice.get-by-id',
  UPDATE_BY_ID = 'invoice.update-by-id',
  DELETE_BY_ID = 'invoice.delete-by-id',
}

enum PRODUCT {
  CREATE = 'product.create',
  GET_BY_ID = 'product.get-by-id',
  GET_ALL = 'product.get-all',
  UPDATE_BY_ID = 'product.update-by-id',
  DELETE_BY_ID = 'product.delete-by-id',
}

export const TCP_REQUEST_MESSAGE = {
  INVOICE,
  PRODUCT,
};