import { NestInterceptor, ExecutionContext, CallHandler, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { Observable } from "rxjs";
import { catchError } from 'rxjs/operators';
import { EntityNotFoundError } from '../domain/errors/entity-not-found.error';
import { NotEnoughProductsInStockError } from '../domain/errors/not-enough-products-in-stock.error';
import { UnsupportedCurrencyConversionError } from '../domain/errors/unsupported-currency-conversion.error';
import { EmptyCartCheckoutError } from '../domain/errors/empty-cart-checkout.error';

// Maps domain errors to HttpException.
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle()
      .pipe(catchError(error => {
        if (error instanceof EntityNotFoundError) {
          throw new NotFoundException(error.message);
        } else if (error instanceof NotEnoughProductsInStockError) {
          throw new ConflictException(error.message);
        } else if (error instanceof UnsupportedCurrencyConversionError) {
          throw new BadRequestException(error.message);
        } else if (error instanceof EmptyCartCheckoutError) {
          throw new ConflictException(error.message);
        } else {
          throw error;
        }
      }))
  }
}