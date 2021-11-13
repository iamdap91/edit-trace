import { ClassSerializerInterceptor, Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductSerializer } from '../serializers';

@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get(':productId')
  async findOne(@Param('productId') productId: string): Promise<ProductSerializer> {
    return await this.productsService.findOne(productId);
  }
}
