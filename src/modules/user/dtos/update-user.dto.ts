import { IsString, IsEmail, IsInt, IsOptional, Min, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'az', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'az@gmail.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 18, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  age?: number;

  @ApiProperty({ example: 'az123', required: false })
  @IsString()
  @Length(6, 20)
  @IsOptional()
  password?: string;
}