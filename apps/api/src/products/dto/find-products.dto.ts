import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindProductsDto {
  @ApiProperty({ description: '오프셋', required: false })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  readonly from: number = 0;

  @ApiProperty({ description: '상품수', required: false })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  readonly size: number = 20;
}
