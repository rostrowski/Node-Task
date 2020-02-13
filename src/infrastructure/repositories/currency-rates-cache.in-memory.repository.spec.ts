import { CurrencyExchangeRates } from '../../domain/currencies/currencies.provider.types';
import { CurrencyRatesInMemoryCacheRepository } from './carrency-rates-cache.in-memory.repository';

const makeSampleExchangeRates = (date: Date): CurrencyExchangeRates => ({
    rates: {
      'PLN': 1.2,
      'EUR': 3
    },
    baseCurrency: 'EUR',
    date,
  })


describe.only('Currencies provider client tests.', () => {
  it('Should obtain rates when cache is empty.', async () => {
    // arrange
    const sampleExchangeRates = makeSampleExchangeRates(new Date());
    const mockedRatesProvider = {
      getRates: jest.fn()
    }

    mockedRatesProvider.getRates.mockReturnValue(Promise.resolve(sampleExchangeRates));

    const now = new Date();
    const sut = new CurrencyRatesInMemoryCacheRepository(mockedRatesProvider, () => now)

    // act
    const result = await sut.getLatestCurrencyRates();

    // assert
   expect(mockedRatesProvider.getRates).toHaveBeenCalledTimes(1);
   expect(result).toStrictEqual(sampleExchangeRates);
  });

  it('Should return cached rates when date has not changed.', async () => {
    // arrange
    const now = new Date(2017, 1, 1);

    const sampleExchangeRates = makeSampleExchangeRates(now);
    const mockedRatesProvider = {
      getRates: jest.fn()
    }

    mockedRatesProvider.getRates.mockReturnValue(Promise.resolve(sampleExchangeRates));

    const sut = new CurrencyRatesInMemoryCacheRepository(mockedRatesProvider, () => now)

    // act
    const firstResult = await sut.getLatestCurrencyRates();
    const secondResult = await sut.getLatestCurrencyRates();

    // assert
    expect(mockedRatesProvider.getRates).toHaveBeenCalledTimes(1);

    expect(firstResult).toStrictEqual(sampleExchangeRates);
    expect(secondResult).toStrictEqual(sampleExchangeRates);
  })

  it('Should refresh cache when date has changed.', async () => {
    // arrange
    const now = new Date(2017, 1, 1);
    const dayAfter = new Date(2017, 1, 2);

    const getDate = jest.fn();
    getDate.mockReturnValueOnce(now);
    getDate.mockReturnValueOnce(dayAfter);

    const sampleExchangeRates = makeSampleExchangeRates(now);
    const newerExchangeRates = { ...makeSampleExchangeRates(dayAfter), baseCurrency: 'USD' }

    const mockedRatesProvider = {
      getRates: jest.fn()
    }

    mockedRatesProvider.getRates.mockReturnValueOnce(Promise.resolve(sampleExchangeRates));
    mockedRatesProvider.getRates.mockReturnValueOnce(Promise.resolve(newerExchangeRates));

    const sut = new CurrencyRatesInMemoryCacheRepository(mockedRatesProvider, getDate)

    // act
    const firstResult = await sut.getLatestCurrencyRates();
    const secondResult = await sut.getLatestCurrencyRates();

    // assert
    expect(mockedRatesProvider.getRates).toHaveBeenCalledTimes(2);

    expect(firstResult).toStrictEqual(sampleExchangeRates);
    expect(secondResult).toStrictEqual(newerExchangeRates);
  })
});
