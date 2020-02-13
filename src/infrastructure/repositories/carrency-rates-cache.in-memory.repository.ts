import { CurrencyRatesRepository } from '../../domain/repositories/currency-rates.repository';
import {
  CurrencyExchangeRates,
  CurrencyRatesProvider,
} from '../../domain/currencies/currencies.provider.types';
import date from 'date-and-time';
import { GetCurrentDate } from '../../shared/date/date-provider.type';
import { Inject } from '@nestjs/common';

interface CachedRates {
  rates: CurrencyExchangeRates;
  date: Date;
}

export class CurrencyRatesInMemoryCacheRepository
  implements CurrencyRatesRepository {
  private cachedRates: CachedRates;

  constructor(
    @Inject('CurrencyRatesProvider')
    private readonly currenciesProvider: CurrencyRatesProvider,
    @Inject('getCurrentDate') private readonly getCurrentDate: GetCurrentDate,
  ) {}

  async getLatestCurrencyRates(): Promise<CurrencyExchangeRates> {
    const now = this.getCurrentDate();

    if (this.cachedRates && date.isSameDay(this.cachedRates.date, now)) {
      return this.cachedRates.rates;
    }

    const rates = await this.currenciesProvider.getRates();

    this.cachedRates = {
      rates,
      date: now,
    };

    return this.cachedRates.rates;
  }
}
