import { CurrencyExchangeRates } from './currencies.provider.types';
import { ProductModel } from '../models/product.model';
import { makeConvertCurrency } from './convert-currency';
import { PriceModel } from '../models/price.model';

export const makeCalculateProductsPrice = (currencyExchangeRates: CurrencyExchangeRates) => 
  (products: ProductModel[], toCurrency: string) => {
    const convertCurrency = makeConvertCurrency(currencyExchangeRates);

    return products.reduce<PriceModel>((accumulator, product) => {
      accumulator.amount += convertCurrency(product.price.currency, toCurrency, product.price.amount) * product.quantity;
      return accumulator;
    }, { amount: 0, currency: toCurrency })
  }