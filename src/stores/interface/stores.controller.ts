import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { FindNearestStoreForCategoryQuery } from '../application/queries/find-nearest-store/find-nearest-store.query';
import { ConfirmStoreAvailabilityCommand } from '../application/commands/confirm-store-availability/confirm-store-availability.command';
import type {
  FindNearestStoreRequest,
  FindNearestStoreResponse,
} from '../application/queries/find-nearest-store/find-nearest-store.dto';
import type {
  ConfirmStoreRequest,
  ConfirmStoreResponse,
} from '../application/commands/confirm-store-availability/confirm-store-availability.dto';

@Controller()
export class StoresController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @GrpcMethod('StoreService', 'FindNearestStoreForCategory')
  async findNearestStoreForCategory(
    data: FindNearestStoreRequest,
  ): Promise<FindNearestStoreResponse> {
    return this.queryBus.execute<
      FindNearestStoreForCategoryQuery,
      FindNearestStoreResponse
    >(
      new FindNearestStoreForCategoryQuery(
        data.productCategory,
        data.clientLat,
        data.clientLng,
      ),
    );
  }

  @GrpcMethod('StoreService', 'ConfirmStoreAvailability')
  async confirmStoreAvailability(
    data: ConfirmStoreRequest,
  ): Promise<ConfirmStoreResponse> {
    return this.commandBus.execute<
      ConfirmStoreAvailabilityCommand,
      ConfirmStoreResponse
    >(new ConfirmStoreAvailabilityCommand(data.storeId, data.orderId));
  }
}
