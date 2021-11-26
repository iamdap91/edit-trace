import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProductSerializer {
  constructor(attributes: Partial<ProductSerializer>) {
    Object.assign(this, attributes);
  }

  @ApiProperty() @Expose() timestamp: string;

  @ApiProperty() @Expose() shopCode: string;

  @ApiProperty() @Expose() productId: string;

  @ApiProperty() @Expose() productName: string;

  @ApiProperty() @Expose() skuNumber: string;

  @ApiProperty() @Expose() primaryCategory: string;

  @ApiProperty() @Expose() secondaryCategory: string;

  @ApiProperty() @Expose() productUrl: string;

  @ApiProperty() @Expose() productImageUrl: string;

  @ApiProperty() @Expose() buyUrl: string;

  @ApiProperty() @Expose() shortProductDescription: string;

  @ApiProperty() @Expose() longProductDescription: string;

  @ApiProperty() @Expose() discount: string;

  @ApiProperty() @Expose() discountType: string;

  @ApiProperty() @Expose() salePrice: string;

  @ApiProperty() @Expose() retailPrice: string;

  @ApiProperty() @Expose() beginDate: string;

  @ApiProperty() @Expose() endDate: string;

  @ApiProperty() @Expose() brand: string;

  @ApiProperty() @Expose() shipping: string;

  @ApiProperty() @Expose() keywords: string;

  @ApiProperty() @Expose() manufacturerPart: string;

  @ApiProperty() @Expose() manufacturerName: string;

  @ApiProperty() @Expose() shippingInformation: string;

  @ApiProperty() @Expose() availability: string;

  @ApiProperty() @Expose() universalProductCode: string;

  @ApiProperty() @Expose() classId: string;

  @ApiProperty() @Expose() currency: string;

  @Exclude() m1: string;

  @Exclude() pixel: string;
}
