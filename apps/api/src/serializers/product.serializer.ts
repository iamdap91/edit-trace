import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RakutenProductSerializer } from './rakuten-product.serializer';

export class ProductSerializer {
  constructor(attributes: Partial<ProductSerializer>) {
    Object.assign(this, attributes);
  }

  @ApiProperty() @Expose() cached: boolean;

  // todo 데이터타입 픽스되면 지정할것
  @ApiProperty() @Expose() product: RakutenProductSerializer | unknown;
}
