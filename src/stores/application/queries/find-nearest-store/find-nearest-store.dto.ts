export interface FindNearestStoreRequest {
  productCategory: string;
  clientLat: number;
  clientLng: number;
}

export interface FindNearestStoreResponse {
  success: boolean;
  storeId?: string;
  storeName?: string;
  storeLat?: number;
  storeLng?: number;
  errorMessage: string;
}
