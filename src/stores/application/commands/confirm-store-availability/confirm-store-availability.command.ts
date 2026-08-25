export class ConfirmStoreAvailabilityCommand {
  constructor(
    public readonly storeId: string,
    public readonly orderId: string,
  ) {}
}
