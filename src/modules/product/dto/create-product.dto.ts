import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
@ApiProperty({
    example: 'M5',
    description: 'The name of the product',
    required: true,
  })
 @IsString()
   @IsNotEmpty()
  name: string;

@ApiProperty({
     example: 'description',
    description: 'The description of the product',
    required: false,
  })
 @IsString()
  description?: string;

@Type(() => Number) 
  @ApiProperty({
    example: 100.99,
    description: 'The price of the product',
     required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;
  @Type(() => Number) 
  @ApiProperty({
    example: 5,
    description: 'The discount of the product',
    required: false,
  })
  @IsNumber()
  discount?: number;
  @Type(() => Number) 
  @ApiProperty({
    example: 5,
    description: 'The rating of the product',
    required: false,
  })
  @IsNumber()
  rating?: number;
  @Type(() => Number) 
  @ApiProperty({
    example: 5,
    description: 'The stock of the product',
    required: false,
  })
  @IsNumber()
  stock?: number;

  @ApiProperty({
    example: 'ajoyib',
    description: 'The status of the product',
    required: false,
  })
  @IsString()
  status?: string;

@ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'produc rasmi',
  })
  image?: any;

}

