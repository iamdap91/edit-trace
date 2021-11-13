import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { productsIndexName } from '@edit-trace/utils';
import { ProductSerializer } from '../serializers';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ProductsService {
  constructor(private elasticsearchService: ElasticsearchService) {}

  async findOne(productId: string): Promise<ProductSerializer> {
    const { body } = await this.elasticsearchService.get({
      index: productsIndexName(),
      id: productId,
    });
    return plainToClass(ProductSerializer, body._source, { excludeExtraneousValues: true });
  }
}
