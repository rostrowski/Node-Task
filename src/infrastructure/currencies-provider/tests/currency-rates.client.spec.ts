import sampleData from './sample-response.json';
import fetch from 'node-fetch';
import { CurrencyRatesClient } from '../currency-rates.client';
import { IncorrectlyFormattedJsonError } from '../../errors/incorrectly-formatted-json.error';
import { FailedToObtainCurrenciesError } from '../../../domain/errors/failed-to-obtain-currencies.error';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
const { Response } = jest.requireActual('node-fetch');

jest.mock('node-fetch');

const API_URL = 'fake_api_url';

const mockFetchResponse = (json: any) => fetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify(json))));

describe('Currencies provider client tests.', () => {
  it('Should return rates successfully obtained from API.', async () => {
    // arrange
    mockFetchResponse(sampleData);

    const sut = new CurrencyRatesClient(API_URL);
    
    // act
    const result = await sut.getRates();

    // assert
    expect(fetch).toHaveBeenCalledWith(API_URL);

    expect(result.baseCurrency).toBe(sampleData.base);
    expect(result.date).toBe(sampleData.date);
    expect(result.rates).toStrictEqual(sampleData.rates);
  });

  it('Should throw an error when JSON obtained from API is incorrectly parsed.', async () => {
    // arrange
    mockFetchResponse({ date: '2007-02-02', base: 'EUR' });
    const sut = new CurrencyRatesClient(API_URL);

    // act and assert
    await expect(sut.getRates()).rejects.toThrow(IncorrectlyFormattedJsonError);
  });

  it('Should throw `FailedToObtainCurrenciesError` when API failed.', async () => {
    // arrange
    fetch.mockReturnValue(Promise.resolve(new Response(JSON.stringify('error'), { status: INTERNAL_SERVER_ERROR })))
    const sut = new CurrencyRatesClient(API_URL);

    // act and assert
    await expect(sut.getRates()).rejects.toThrow(FailedToObtainCurrenciesError);
  })
});
