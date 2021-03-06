import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, ClassSerializerInterceptor, Controller, Get, Param, Post, Query, UseInterceptors } from '@nestjs/common';
import { CachedProductSerializer, ProductSerializer } from '@edit-trace/models';
import { ProductsService } from './products.service';
import { FindProductsDto, SyncProductDto } from './dto';

@ApiTags('products')
@Controller('products')
@UseInterceptors(ClassSerializerInterceptor)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // todo 나중에 검색으로 빼버리자. 그때 엔드포인트도 빼버리고
  @Get('list')
  @ApiOperation({ summary: '상품 리스트' })
  @ApiResponse({ status: 200, type: [ProductSerializer] })
  async find(@Query() query: FindProductsDto): Promise<ProductSerializer[]> {
    const { from, size } = query;
    return await this.productsService.find(from, size);
  }

  @Get(':productId')
  @ApiOperation({ summary: '단일 상품 정보' })
  @ApiResponse({ status: 200, type: [CachedProductSerializer] })
  async findOne(@Param('productId') productId: string): Promise<CachedProductSerializer> {
    return await this.productsService.findOneCache(productId);
  }

  @Get(':productId/history')
  @ApiOperation({ summary: '단일 상품 히스토리' })
  @ApiResponse({ status: 200, type: [ProductSerializer] })
  async findOneHistory(@Param('productId') productId: string): Promise<ProductSerializer[]> {
    return await this.productsService.findOneHistory(productId);
  }

  @Post(':productId/sync')
  @ApiOperation({ summary: '상품 싱크' })
  async sync(@Body() body: SyncProductDto) {
    await this.productsService.sync(body.productId);
  }
}
