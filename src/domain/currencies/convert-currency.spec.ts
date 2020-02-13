import { makeConvertCurrency } from './convert-currency';
import { UnsupportedCurrencyConversionError } from '../errors/unsupported-currency-conversion.error';

const exchangeRates = {
  rates: {
    PLN: 4,
    GBP: 0.85,
    CAD: 1.4604,
    HKD: 8.5168,
    ISK: 137.9,
    PHP: 55.816,
    DKK: 7.4724,
    HUF: 338.15,
    CZK: 25.03,
    AUD: 1.6417,
  },
  baseCurrency: 'EUR',
  date: new Date(),
};

describe('Convert currency tests.', () => {
  it('Throws when converting unsupported currencies', () => {
    // arrange
    const convertCurrency = makeConvertCurrency(exchangeRates);

    // act and assert
    expect(() => convertCurrency('EUR', 'UNSUPPORTED', 1)).toThrow(
      UnsupportedCurrencyConversionError,
    );
    expect(() => convertCurrency('UNSUPPORTED', 'EUR', 1)).toThrow(
      UnsupportedCurrencyConversionError,
    );
  });

  it('Returns the same amount when converting to the same currency.', () => {
    // arrange
    const convertCurrency = makeConvertCurrency(exchangeRates);
    const amount = 5;

    // act
    const result = convertCurrency('EUR', 'EUR', amount);

    // assert
    expect(result).toEqual(amount);
  });

  it('Converts currencies when converting from base currency.', () => {
    // arrange
    const convertCurrency = makeConvertCurrency(exchangeRates);
    const amount = 5;

    // act
    const result = convertCurrency('EUR', 'PLN', amount);

    // assert
    expect(result).toEqual(amount * exchangeRates.rates.PLN);
  });

  it('Convertes currencies when converting from non-base currency to base currency.', () => {
    // arrange
    const convertCurrency = makeConvertCurrency(exchangeRates);
    const amount = 4;

    // act
    const result = convertCurrency('PLN', 'EUR', amount);

    // assert
    expect(result).toEqual(amount / exchangeRates.rates.PLN);
  });

  it('Convertes currencies when converting from non-base currency to non-base currency.', () => {
    // arrange
    const convertCurrency = makeConvertCurrency(exchangeRates);
    const amount = 10;

    // act
    const result = convertCurrency('PLN', 'GBP', amount);

    // assert
    expect(result).toEqual(2.13);
  });
});
