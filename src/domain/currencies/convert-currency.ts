import { CurrencyExchangeRates } from './currencies.provider.types';
import { UnsupportedCurrencyConversionError } from '../errors/unsupported-currency-conversion.error';

const ROUND_TO = 2;

const roundNumber = (numberToRound: number) => +(numberToRound.toFixed(ROUND_TO));

export const makeConvertCurrency = (exchangeRates: CurrencyExchangeRates) => (from: string, to: string, amount: number) => {
  const currencies = [ ...Object.keys(exchangeRates.rates), exchangeRates.baseCurrency ];

  if (!currencies.includes(from) || !currencies.includes(to)) {
    throw new UnsupportedCurrencyConversionError(`Cannot convert ${from} currency to ${to} currency`)
  }

  if (from === to) {
    return amount;
  }

  if (from === exchangeRates.baseCurrency) {
    return roundNumber(amount * exchangeRates.rates[to])
  }

  if (to === exchangeRates.baseCurrency) {
    return roundNumber(amount / exchangeRates.rates[from])
  }

  const targetToBaseCurrency = amount / exchangeRates.rates[from];

  return roundNumber(targetToBaseCurrency * exchangeRates.rates[to]);
}