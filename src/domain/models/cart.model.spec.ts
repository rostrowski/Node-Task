import { CartModel } from './cart/cart.model';
import { ProductModel } from './product.model';

const sampleProduct: ProductModel = {
  name: 'test product',
  id: '1',
  price: {
    amount: 100,
    currency: 'EUR',
  },
  quantity: 1,
}

describe('Cart model', () => {
  it('Adds a product that wasn`t previously in a cart.', () => {
    // arrange
    const sut = new CartModel();

    // act
    sut.addProduct(sampleProduct);

    // assert
    const productsInCart = sut.getProducts();
    expect(productsInCart).toStrictEqual([ sampleProduct ]);
    expect(productsInCart[0]).toStrictEqual(sampleProduct);
    expect(productsInCart[0].quantity).toBe(1);
  })

  it('Adding another product to cart increases its quantity.', () => {
    // arrange
    const sut = new CartModel();

    // act
    sut.addProduct(sampleProduct);
    sut.addProduct(sampleProduct);

    // assert
    const productsInCart = sut.getProducts();
    expect(productsInCart[0].quantity).toBe(2);
  })

  it('Removing non existing product from cart does nothing.', () => {
    // arrange
    const sut = new CartModel();

    // act
    const removedProductsCount = sut.removeProduct('1', 1);

    // assert
    const productsInCart = sut.getProducts();
    console.log(productsInCart)
    expect(productsInCart.length).toBe(0);
    expect(removedProductsCount).toBe(0);
  })

  it('Removing one of many existing products reduces product`s quantity.', () => {
    // arrange
    const sut = new CartModel();

    // act
    sut.addProduct({ ...sampleProduct, quantity: 2 });
    const removedProductsCount = sut.removeProduct(sampleProduct.id, 1);

    // assert
    const productsInCart = sut.getProducts();
    expect(productsInCart.length).toBe(1);
    expect(productsInCart[0].quantity).toBe(1);
    expect(removedProductsCount).toBe(1);
  })

  it('Removing all instances of one product removes it from cart.', () => {
    // arrange
    const sut = new CartModel();

    // act
    sut.addProduct(sampleProduct);
    const removedProductsCount = sut.removeProduct(sampleProduct.id, 1);

    // assert
    const productsInCart = sut.getProducts();
    console.log(productsInCart)
    expect(productsInCart.length).toBe(0);
    expect(removedProductsCount).toBe(1);
  })

  it('Removing more instances of one product than already in cart removes it from cart.', () => {
    // arrange
    const sut = new CartModel();

    // act
    sut.addProduct({ ...sampleProduct, quantity: 2 });
    const removedProductsCount = sut.removeProduct(sampleProduct.id, 3);

    // assert
    const productsInCart = sut.getProducts();
    expect(productsInCart.length).toBe(0);
    expect(removedProductsCount).toBe(2);
  })
})