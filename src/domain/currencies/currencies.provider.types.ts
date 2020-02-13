interface ExchangeRate {
  [key: string]: number;
}

export interface CurrencyExchangeRates {
  rates: ExchangeRate;
  baseCurrency: string;
  date: Date;
}

export interface CurrencyRatesProvider {
  getRates(): Promise<CurrencyExchangeRates>;
}
