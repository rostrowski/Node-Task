import { CurrencyRatesRepository } from '../repositories/currency-rates.repository';
import { makeConvertCurrency } from './convert-currency';

export class CurrencyConverterService {
  constructor(
    private readonly currencyRatesRepository: CurrencyRatesRepository,
  ) {}

  async convertCurrency(from: string, to: string, amount: number) {
    const exchangeRates = await this.currencyRatesRepository.getLatestCurrencyRates();

    const convert = makeConvertCurrency(exchangeRates);

    return convert(from, to, amount);
  }
}
