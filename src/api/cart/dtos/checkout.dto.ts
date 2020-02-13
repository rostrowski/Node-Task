import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CheckoutDto {
  @IsString()
  @ApiProperty({
    description: 'Currency in which the final price will be calculated.'
  })
  currency: string;
}