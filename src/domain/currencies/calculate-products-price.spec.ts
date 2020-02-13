import { makeCalculateProductsPrice } from './calculate-products-price';

const exchangeRates = {
  rates: {
    PLN: 4,
  },
  baseCurrency: 'EUR',
  date: new Date(),
};

describe('Calculate products price tests', () => {
  it('Calculates price in a target currency', () => {
    // arrange
    const calculateProductsPrice = makeCalculateProductsPrice(exchangeRates);

    const products = [
      {
        price: {
          amount: 100,
          currency: 'PLN',
        },
        quantity: 10,
      },
      {
        price: {
          amount: 10,
          currency: 'EUR',
        },
        quantity: 1,
      },
    ];

    // act
    const productPriceInEuro = calculateProductsPrice(products as any, 'EUR');

    // assert
    expect(productPriceInEuro).toStrictEqual({
      currency: 'EUR',
      amount: 250 + 10,
    });
  });
});
