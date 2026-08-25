export class FindNearestStoreForCategoryQuery {
  constructor(
    public readonly productCategory: string,
    public readonly clientLat: number,
    public readonly clientLng: number,
  ) {}
}
