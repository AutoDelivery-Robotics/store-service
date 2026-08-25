import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FindNearestStoreForCategoryQuery } from './find-nearest-store.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from '../../../infrastructure/entities/store.entity';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

@QueryHandler(FindNearestStoreForCategoryQuery)
export class FindNearestStoreForCategoryHandler implements IQueryHandler<FindNearestStoreForCategoryQuery> {
  private readonly logger = new Logger(FindNearestStoreForCategoryHandler.name);

  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async execute(query: FindNearestStoreForCategoryQuery): Promise<any> {
    this.logger.log(
      `Finding nearest store for category ${query.productCategory} near (${query.clientLat}, ${query.clientLng})`,
    );

    // Using Haversine formula to calculate distance in km
    const queryBuilder = this.storeRepository
      .createQueryBuilder('store')
      .innerJoin('store.products', 'product')
      .where('product.category = :category', {
        category: query.productCategory,
      })
      .andWhere('product.is_available = :isAvailable', { isAvailable: true })
      .andWhere('store.isActive = :isActive', { isActive: true })
      .andWhere('store.lat IS NOT NULL AND store.lng IS NOT NULL')
      .addSelect(
        `(6371 * acos(cos(radians(:lat)) * cos(radians(store.lat)) * cos(radians(store.lng) - radians(:lng)) + sin(radians(:lat)) * sin(radians(store.lat))))`,
        'distance',
      )
      .setParameters({ lat: query.clientLat, lng: query.clientLng })
      .orderBy('distance', 'ASC')
      .limit(1);

    const result = await queryBuilder.getRawAndEntities();

    if (result.entities.length === 0) {
      return {
        success: false,
        errorMessage: 'No store found for the requested category',
      };
    }

    const nearestStore = result.entities[0];
    return {
      success: true,
      storeId: nearestStore.id,
      storeName: nearestStore.name,
      storeLat: nearestStore.lat,
      storeLng: nearestStore.lng,
      errorMessage: '',
    };
  }
}
