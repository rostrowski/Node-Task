import { IsString, IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ProductDto {
  @IsString()
  @ApiProperty({
    description: 'id of a product that will be added to the cart'
  })
  productId: string;

  @IsNumber()
  @ApiProperty({
    description: 'Number of products to add'
  })
  quantity: number;
}