import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CartModule } from '../src/api/cart/cart.module';
import { CREATED, OK, NOT_FOUND, CONFLICT, BAD_REQUEST } from 'http-status-codes';
const request = require('supertest');

const exchangeRates = {
  rates: {
    'PLN': 4
  },
  baseCurrency: 'EUR',
  date: new Date(),
}

const currencyRatesProvider = {
  getRates: jest.fn().mockReturnValue(exchangeRates)
}

describe('CartController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CartModule],
    })
    .overrideProvider('CurrencyRatesProvider')
    .useValue(currencyRatesProvider)
    .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('Errors', () => {
    it('Returns 404 when cart does not exist.', async () => {
      await request(app.getHttpServer())
        .get('/cart/non-existing-id')
        .expect(NOT_FOUND);
    })

    it('Returns 404 when checking out non-existing cart.', async () => {
      await request(app.getHttpServer())
        .post('/cart')
        .expect(CREATED);

      await request(app.getHttpServer())
        .post(`/cart/non-existing-id/checkout`)
        .send({ currency: 'EUR' })
        .expect(NOT_FOUND);
    })

    it('Returns 404 when adding non existing product.', async () => {
      const cartId = (await request(app.getHttpServer())
        .post('/cart')
        .expect(CREATED)).text;

      await request(app.getHttpServer())
        .post(`/cart/${cartId}`)
        .send({ productId: 'non-existing', quantity: 1 })
        .expect(NOT_FOUND);
    })

    it('Returns 404 when adding a product to non existing cart.', async () => {
      await request(app.getHttpServer())
        .post(`/cart/non-existing-id`)
        .send({ productId: '1', quantity: 1 })
        .expect(NOT_FOUND);
    })

    it('Returns 400 when passing incorrect body to add-new-product.', async () => {
      const cartId = (await request(app.getHttpServer())
        .post('/cart')
        .expect(CREATED)).text;

      await request(app.getHttpServer())
        .post(`/cart/${cartId}`)
        .expect(BAD_REQUEST);
    })

    it('Returns 400 when passing incorrect body to remove-product.', async () => {
      const cartId = (await request(app.getHttpServer())
        .post('/cart')
        .expect(CREATED)).text;

      await request(app.getHttpServer())
        .delete(`/cart/${cartId}`)
        .expect(BAD_REQUEST);
    })

    it('Returns 409 when checking out an empty cart.', async () => {
      const cartId = (await request(app.getHttpServer())
        .post('/cart')
        .expect(CREATED)).text;

      await request(app.getHttpServer())
        .post(`/cart/${cartId}/checkout`)
        .send({ currency: 'EUR' })
        .expect(CONFLICT);
    })
  })

  describe('Happy path', () => {
    it('Passes a full path', async () => {
      const cartId = (await request(app.getHttpServer())
        .post('/cart')
        .expect(CREATED)).text;
  
      expect(cartId).toBeDefined();
  
      const cartAfterCreated = (await request(app.getHttpServer())
        .get(`/cart/${cartId}`)
        .expect(OK)).text;

      expect(JSON.parse(cartAfterCreated)).toStrictEqual({
        cartId,
        products: [],
      })

      const cartWithTwoProducts = (await request(app.getHttpServer())
        .post(`/cart/${cartId}`)
        .send({ productId: '1', quantity: 2 })
        .expect(CREATED)).text;

      const cartWithTwoProductsJson = JSON.parse(cartWithTwoProducts);
      expect(cartWithTwoProductsJson.cartId).toBe(cartId);
      expect(cartWithTwoProductsJson.products[0].quantity).toBe(2);
      expect(cartWithTwoProductsJson.products[0].productId).toBe('1');

      const cartWithOneProduct = (await request(app.getHttpServer())
        .delete(`/cart/${cartId}`)
        .send({ productId: '1', quantity: 1 })
        .expect(OK)).text;

      const cartWithOneProductJson = JSON.parse(cartWithOneProduct);
      expect(cartWithOneProductJson.cartId).toBe(cartId);
      expect(cartWithOneProductJson.products[0].quantity).toBe(1);
      expect(cartWithOneProductJson.products[0].productId).toBe('1');

      const cartAfterCheckout = (await request(app.getHttpServer())
        .post(`/cart/${cartId}/checkout`)
        .send({ currency: 'EUR' })
        .expect(CREATED)).text;

      const cartAfterCheckoutJson = JSON.parse(cartAfterCheckout);
      expect(cartAfterCheckoutJson.orderedProducts[0].productId).toBe('1');
      expect(cartAfterCheckoutJson.orderedProducts[0].quantity).toBe(1);
      expect(cartAfterCheckoutJson.priceToPay.currency).toBe('EUR');
    })
  })

  afterAll(async () => {
    await app.close();
  })
});
