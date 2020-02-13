import { CurrencyExchangeRates } from '../currencies/currencies.provider.types';

export interface CurrencyRatesRepository {
  getLatestCurrencyRates: () => Promise<CurrencyExchangeRates>;
}
