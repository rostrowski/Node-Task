import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from '../../domain/services/cart.service';
import { CartInMemoryRepository } from '../../infrastructure/repositories/cart.in-memory.repository';
import { CartApplicationService } from './services/cart.application-service';
import { ProductInMemoryRepository } from '../../infrastructure/repositories/product.in-memory.repository';
import { CurrencyRatesInMemoryCacheRepository } from '../../infrastructure/repositories/carrency-rates-cache.in-memory.repository';
import { DateProvider } from '../../shared/date/date-provider';
import { CurrencyRatesClient } from '../../infrastructure/currencies-provider/currency-rates.client';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [CartController],
  providers: [
    CartService,
    CartApplicationService,
    ConfigService,
    {
      provide: 'CartRepository',
      useClass: CartInMemoryRepository,
    },
    {
      provide: 'API_URL',
      useValue: process.env.CURRENCY_RATES_API_URL,
    },
    {
      provide: 'ProductRepository',
      useClass: ProductInMemoryRepository,
    },
    {
      provide: 'CurrencyRatesRepository',
      useClass: CurrencyRatesInMemoryCacheRepository,
    },
    {
      provide: 'getCurrentDate',
      useValue: DateProvider,
    },
    {
      provide: 'CurrencyRatesProvider',
      useClass: CurrencyRatesClient,
    },
  ],
})
export class CartModule {}
