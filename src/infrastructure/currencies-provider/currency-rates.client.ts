import fetch from 'node-fetch';
import { CurrencyRatesProvider, CurrencyExchangeRates } from '../../domain/currencies/currencies.provider.types';
import { FailedToObtainCurrenciesError } from '../../domain/errors/failed-to-obtain-currencies.error';
import { IncorrectlyFormattedJsonError } from '../errors/incorrectly-formatted-json.error';
import { OK } from 'http-status-codes';
import { Logger, Inject } from '@nestjs/common';

export class CurrencyRatesClient implements CurrencyRatesProvider {
  constructor (@Inject('API_URL') private readonly apiUrl: string) {}

  async getRates(): Promise<CurrencyExchangeRates> {
    const json = await this.getApiResultOrThrow();
    const rates = this.mapApiResultToSchema(json);

    return rates;
  }

  private async makeApiRequest() {
    const response = await fetch(this.apiUrl);

    if (response.status !== OK) {
      throw new Error(`Currencies API failed with status=${response.status} and statusText=${response.statusText}`);
    }

    return response.json();
  }

  private mapApiResultToSchema(json: any): CurrencyExchangeRates {
    if (!json.rates || !json.base || !json.date) {
      throw new IncorrectlyFormattedJsonError(`JSON obtained from ${this.apiUrl} is incorrectly formatted and cannot be parsed.`);
    }

    const { rates, base, date } = json;

    return {
      rates,
      baseCurrency: base,
      date,
    }
  }

  private async getApiResultOrThrow() {
    let apiResult;

    try {
      apiResult = await this.makeApiRequest();
      Logger.log(`Obtained new rates from ${this.apiUrl}`)
    } catch (e) {
      Logger.error(`Exchange rates API failed`, e.stack, e);
      throw new FailedToObtainCurrenciesError();
    }

    return apiResult;
  }
}
