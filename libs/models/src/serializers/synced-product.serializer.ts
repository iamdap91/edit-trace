import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SyncedProductSerializer {
  constructor(attributes: Partial<SyncedProductSerializer>) {
    Object.assign(this, attributes);
  }

  @ApiProperty() @Expose() timestamp: string;

  @ApiProperty() @Expose() id: string;

  @ApiProperty() @Expose() name: string;

  @ApiProperty() @Expose() price: number;

  @ApiProperty() @Expose() salePrice: number;

  @ApiProperty() @Expose() currency: string;

  @ApiProperty() @Expose() images: string[];
}
