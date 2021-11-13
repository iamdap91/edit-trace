import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClassSerializerInterceptor, Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductSerializer } from '../serializers';

@ApiTags('products')
@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get(':productId')
  @ApiOperation({ summary: '단일 상품 정보' })
  @ApiResponse({ status: 200, type: ProductSerializer })
  async findOne(@Param('productId') productId: string): Promise<ProductSerializer> {
    return await this.productsService.findOne(productId);
  }
}
