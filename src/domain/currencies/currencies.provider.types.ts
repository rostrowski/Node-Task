type ExchangeRate = {
  [key: string]: number;
}

export type CurrencyExchangeRates = {
  rates: ExchangeRate;
  baseCurrency: string;
  date: Date,
}

export interface CurrencyRatesProvider {
  getRates() : Promise<CurrencyExchangeRates> 
}