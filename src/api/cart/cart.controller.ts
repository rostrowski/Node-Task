import { Controller, Get, Post, Delete, Param, Body, UseInterceptors, UseFilters } from '@nestjs/common';
import { CartService } from '../../domain/services/cart.service';
import { CartDto } from './dtos/cart.dto';
import { CartApplicationService } from './services/cart.application-service';
import { ValidationPipe } from '../validation.pipe';
import { ProductDto } from './dtos/product.dto';
import { ErrorInterceptor } from '../error.interceptor';
import { CheckoutDto } from './dtos/checkout.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpExceptionFilter } from '../http-exception.filter';

@UseInterceptors(ErrorInterceptor)
@UseFilters(new HttpExceptionFilter())
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService, private readonly cartApplicationService: CartApplicationService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Obtains an existing cart that has not been checked out yet.' })
  @ApiResponse({ status: 200, description: 'Existing cart' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Cart with a given id not found or already checked out.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getCart(@Param('id') id: string): Promise<CartDto> {
    const cartDto = await this.cartApplicationService.getCartById(id);

    return cartDto;
  }

  @Post()
  @ApiOperation({ summary: 'Creates a new cart.' })
  @ApiResponse({ status: 201, description: 'Cart successfully created, returns new cart id.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createNewCart(): Promise<string> {
    const newCartId = await this.cartService.createNew();
    
    return newCartId;
  }

  @Post(':id')
  @ApiOperation({ summary: 'Adds product(s) to the cart.' })
  @ApiResponse({ status: 201, description: 'Product(s) successfully added, returns updated cart.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Cart with a given id or product with a given id not found.' })
  @ApiResponse({ status: 409, description: 'Product(s) quantity exceeds stock`s capacity.'})
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async addItemsToCart(@Param('id') id: string, @Body(new ValidationPipe()) productDto: ProductDto): Promise<CartDto> {
    const cartDto = await this.cartApplicationService.addProductToCart(id, productDto);
    return cartDto;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Removes product(s) from the cart.' })
  @ApiResponse({ status: 200, description: 'Product(s) successfully removed, returns updated cart.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'Cart with a given id not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async removeItemsFromCart(@Param('id') id: string, @Body(new ValidationPipe()) productDto: ProductDto): Promise<CartDto> {
    const cartDto = await this.cartApplicationService.removeProductFromCart(id, productDto);
    return cartDto;
  }

  @Post(':id/checkout')
  @ApiOperation({ summary: 'Cart`s checkout.' })
  @ApiResponse({ status: 201, description: 'Cart successfully checked out, returns cart`s summary.' })
  @ApiResponse({ status: 400, description: 'Bad request, including unsupported currency.' })
  @ApiResponse({ status: 404, description: 'Cart with a given id not found.' })
  @ApiResponse({ status: 409, description: 'Attempted to check out an empty cart.'})
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async checkout(@Param('id') id: string, @Body(new ValidationPipe()) checkoutDto: CheckoutDto) {
    const cartDto = await this.cartApplicationService.checkout(id, checkoutDto.currency);
    return cartDto;
  }
}
