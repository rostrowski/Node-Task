export class ProductInCartDto {
  quantity: number;
  name: string;
  price: {
    amount: number,
    currency: string,
  };
  productId: string;
}