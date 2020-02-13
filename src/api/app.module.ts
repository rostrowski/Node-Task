import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), CartModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
