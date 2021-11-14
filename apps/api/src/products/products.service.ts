import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { productsIndexName } from '@edit-trace/utils';
import { ProductSerializer } from '../serializers';

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

  async findOneHistory(productId: string): Promise<ProductSerializer[]> {
    const {
      body: {
        hits: { hits },
      },
    } = await this.elasticsearchService.search({
      body: {
        query: {
          bool: {
            must: [{ term: { productId } }],
          },
        },
      },
    });

    return hits.map((hit) => plainToClass(ProductSerializer, hit._source, { excludeExtraneousValues: true }));
  }

  async find(): Promise<ProductSerializer[]> {
    const {
      body: {
        hits: { hits },
      },
    } = await this.elasticsearchService.search({
      index: productsIndexName(),
      body: { size: 20 },
    });
    return hits.map((hit) => plainToClass(ProductSerializer, hit._source, { excludeExtraneousValues: true }));
  }
}
