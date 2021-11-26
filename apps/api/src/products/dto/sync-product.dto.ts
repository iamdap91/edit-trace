import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SyncProductDto {
  @ApiProperty({ description: '상품 ID', required: true })
  @IsOptional()
  @IsString()
  readonly productId: string;
}
