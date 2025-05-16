import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadImageDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true, description: 'User image file' })
  @IsString()
  image: string;
}