export interface ConfirmStoreRequest {
  storeId: string;
  orderId: string;
}

export interface ConfirmStoreResponse {
  success: boolean;
  errorMessage: string;
}
