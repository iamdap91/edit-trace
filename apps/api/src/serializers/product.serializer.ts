import { Exclude, Expose } from 'class-transformer';

export class ProductSerializer {
  constructor(attributes: Partial<ProductSerializer>) {
    Object.assign(this, attributes);
  }

  @Exclude() '@timestamp': string;

  @Expose()
  get timeStamp() {
    return this['@timestamp'];
  }
  @Expose() productId: string;

  @Expose() productName: string;

  @Expose() skuNumber: string;

  @Expose() primaryCategory: string;

  @Expose() secondaryCategory: string;

  @Expose() productUrl: string;

  @Expose() productImageUrl: string;

  @Expose() buyUrl: string;

  @Expose() shortProductDescription: string;

  @Expose() longProductDescription: string;

  @Expose() discount: string;

  @Expose() discountType: string;

  @Expose() salePrice: string;

  @Expose() retailPrice: string;

  @Expose() beginDate: string;

  @Expose() endDate: string;

  @Expose() brand: string;

  @Expose() shipping: string;

  @Expose() keywords: string;

  @Expose() manufacturerPart: string;

  @Expose() manufacturerName: string;

  @Expose() shippingInformation: string;

  @Expose() availability: string;

  @Expose() universalProductCode: string;

  @Expose() classId: string;

  @Expose() currency: string;

  @Exclude() m1: string;

  @Exclude() pixel: string;
}
