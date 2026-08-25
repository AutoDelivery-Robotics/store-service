import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterStoreCommand } from './register-store.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from '../../../infrastructure/entities/store.entity';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

@CommandHandler(RegisterStoreCommand)
export class RegisterStoreHandler implements ICommandHandler<RegisterStoreCommand> {
  private readonly logger = new Logger(RegisterStoreHandler.name);

  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async execute(command: RegisterStoreCommand): Promise<Store> {
    this.logger.log(`Registering new store: ${command.name}`);
    const store = this.storeRepository.create({
      name: command.name,
      address: command.address,
      lat: command.lat,
      lng: command.lng,
    });
    return this.storeRepository.save(store);
  }
}
