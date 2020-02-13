import { CartService } from './cart.service';
import { EntityNotFoundError } from '../errors/entity-not-found.error';
import { ProductModel } from '../models/product.model';
import { NotEnoughProductsInStockError } from '../errors/not-enough-products-in-stock.error';
import { CartModel } from '../models/cart/cart.model';
import { EmptyCartCheckoutError } from '../errors/empty-cart-checkout.error';
describe('Cart service tests.', () => {
  it('Throw `EntityNotFound` error when cart was not found', () => {
    // arrange
    const cartRepository = {
      findCart: jest.fn().mockReturnValue(Promise.resolve(undefined))
    }

    const sut = new CartService(cartRepository as any, jest.fn() as any, jest.fn() as any);

    // act and assert
    expect(sut.addProductToCart('1', '1', 1)).rejects.toThrow(EntityNotFoundError);
  })

  it('Throw `EntityNotFound` error when product was not found', async () => {
    // arrange
    const cartRepository = {
      findCart: jest.fn().mockReturnValue(Promise.resolve({ id: 1 }))
    }

    const productRepository = {
      findProduct: jest.fn().mockReturnValue(Promise.resolve(undefined))
    }

    const sut = new CartService(cartRepository as any, productRepository as any, jest.fn() as any);

    // act and assert
    await expect(sut.addProductToCart('1', '1', 1)).rejects.toThrow(EntityNotFoundError);
    expect(productRepository.findProduct).toHaveBeenCalled();
  })

  it('Throw `NotEnoughProductsInStock` error when not enough products in stock.', async () => {
    // arrange
    const cartRepository = {
      findCart: jest.fn().mockReturnValue(Promise.resolve({ id: 1 }))
    }

    const sampleProduct: ProductModel = {
      name: 'test product',
      id: '1',
      price: {
        amount: 100,
        currency: 'EUR',
      },
      quantity: 1,
    }

    const productRepository = {
      findProduct: jest.fn().mockReturnValue(Promise.resolve(sampleProduct))
    }

    const sut = new CartService(cartRepository as any, productRepository as any, jest.fn() as any);

    // act and assert
    await expect(sut.addProductToCart('1', '1', 2)).rejects.toThrow(NotEnoughProductsInStockError);
  })

  it('Adds a product to cart.', async () => {
    // arrange
    const cart = new CartModel();

    const cartRepository = {
      findCart: jest.fn().mockReturnValue(Promise.resolve(cart)),
    }

    const sampleProduct: ProductModel = {
      name: 'test product',
      id: '1',
      price: {
        amount: 100,
        currency: 'EUR',
      },
      quantity: 2,
    }

    const productRepository = {
      findProduct: jest.fn().mockReturnValue(Promise.resolve(sampleProduct)),
      removeProduct: jest.fn(),
    }

    const sut = new CartService(cartRepository as any, productRepository as any, jest.fn() as any);

    // act
    await sut.addProductToCart('1', '1', 2);

    // assert
    expect(cart.getProducts()).toStrictEqual([ sampleProduct ]);
    expect(productRepository.removeProduct).toHaveBeenCalled();
  })

  it('Removes products from cart.', async () => {
    // arrange
    const productId = '1';
    const cart = new CartModel();

    const cartRepository = {
      findCart: jest.fn().mockReturnValue(Promise.resolve(cart)),
    }

    const sampleProduct: ProductModel = {
      name: 'test product',
      id: productId,
      price: {
        amount: 100,
        currency: 'EUR',
      },
      quantity: 2,
    }

    const productRepository = {
      findProduct: jest.fn().mockReturnValue(Promise.resolve(sampleProduct)),
      removeProduct: jest.fn(),
      addProduct: jest.fn(),
    }

    const sut = new CartService(cartRepository as any, productRepository as any, jest.fn() as any);

    // act
    await sut.addProductToCart('1', productId, 2);
    await sut.removeProductFromCart('1', productId, 1);

    // assert
    expect(cart.getProducts()).toStrictEqual([ { ...sampleProduct, quantity: 1 } ]);
    expect(productRepository.addProduct).toHaveBeenCalledWith(productId, 1);
  })

  it('It is impossible to checkout an empty cart.', async () => {
    // arrange
    const cart = new CartModel();

    const cartRepository = {
      findCart: jest.fn().mockReturnValue(Promise.resolve(cart)),
    }

    const sut = new CartService(cartRepository as any, jest.fn() as any, jest.fn() as any);

    // act and assert
    expect(sut.checkout('1', 'USD')).rejects.toThrow(EmptyCartCheckoutError);
  })

  it('Returns a checked out cart.', async () => {
    // arrange
    const cart = new CartModel();
    const productId = '1';
    const checkoutCurrency = 'EUR';

    const exchangeRates = {
      rates: {
        'PLN': 4
      },
      baseCurrency: 'EUR',
      date: new Date(),
    }

    const sampleProduct: ProductModel = {
      name: 'test product',
      id: productId,
      price: {
        amount: 100,
        currency: 'EUR',
      },
      quantity: 2,
    }

    cart.products = { productId: sampleProduct };

    const cartRepository = {
      findCart: jest.fn().mockReturnValue(Promise.resolve(cart)),
      saveCheckedOutCart: jest.fn(),
      removeCart: jest.fn(),
    }

    const exchangeRatesRepository = {
      getLatestCurrencyRates: jest.fn().mockReturnValue(exchangeRates)
    }

    const sut = new CartService(cartRepository as any, jest.fn() as any, exchangeRatesRepository as any);

    // act
    const checkedOutCart = await sut.checkout('1', checkoutCurrency);

    // assert
    expect(checkedOutCart.price).toStrictEqual({ currency: checkoutCurrency, amount: 200 });
    
    expect(cartRepository.saveCheckedOutCart).toHaveBeenCalled();
    expect(cartRepository.removeCart).toHaveBeenCalled();
  })
})