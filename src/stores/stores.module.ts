import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './infrastructure/entities/store.entity';
import { StoreProduct } from './infrastructure/entities/store-product.entity';
import { RegisterStoreHandler } from './application/commands/register-store/register-store.handler';
import { ConfirmStoreAvailabilityHandler } from './application/commands/confirm-store-availability/confirm-store-availability.handler';
import { FindNearestStoreForCategoryHandler } from './application/queries/find-nearest-store/find-nearest-store.handler';
import { StoresController } from './interface/stores.controller';

const CommandHandlers = [RegisterStoreHandler, ConfirmStoreAvailabilityHandler];
const QueryHandlers = [FindNearestStoreForCategoryHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Store, StoreProduct])],
  controllers: [StoresController],
  providers: [...CommandHandlers, ...QueryHandlers],
})
export class StoresModule {}
