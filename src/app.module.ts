import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StoresModule } from './stores/stores.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SharedHealthModule, SharedLoggerModule } from 'core-shared-nestjs';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASS', 'postgres'),
        database: configService.get<string>('DB_NAME', 'store_db'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: 'KAFKA_SERVICE',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'store-service',
              brokers: [
                configService.get<string>('KAFKA_BROKER', 'localhost:9092'),
              ],
            },
            consumer: {
              groupId: 'store-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    SharedHealthModule,
    SharedLoggerModule,
    StoresModule,
  ],
})
export class AppModule {}
