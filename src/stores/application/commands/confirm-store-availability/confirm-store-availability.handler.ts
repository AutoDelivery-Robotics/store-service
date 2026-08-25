import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmStoreAvailabilityCommand } from './confirm-store-availability.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from '../../../infrastructure/entities/store.entity';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

@CommandHandler(ConfirmStoreAvailabilityCommand)
export class ConfirmStoreAvailabilityHandler implements ICommandHandler<ConfirmStoreAvailabilityCommand> {
  private readonly logger = new Logger(ConfirmStoreAvailabilityHandler.name);

  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async execute(
    command: ConfirmStoreAvailabilityCommand,
  ): Promise<{ success: boolean; errorMessage: string }> {
    this.logger.log(
      `Confirming availability for store ${command.storeId} on order ${command.orderId}`,
    );

    const store = await this.storeRepository.findOne({
      where: { id: command.storeId },
    });
    if (!store) {
      return { success: false, errorMessage: 'Store not found' };
    }

    if (!store.isActive) {
      return { success: false, errorMessage: 'Store is not active' };
    }

    // In a real scenario, you might check if the specific products in the order are still in stock.
    // For now, we return success if the store exists and is active.

    this.logger.log(
      `Store ${command.storeId} is available for order ${command.orderId}`,
    );
    return { success: true, errorMessage: '' };
  }
}
