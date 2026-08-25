export class RegisterStoreCommand {
  constructor(
    public readonly name: string,
    public readonly address: string,
    public readonly lat: number,
    public readonly lng: number,
  ) {}
}
