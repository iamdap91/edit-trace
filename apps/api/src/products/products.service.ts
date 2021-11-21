import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { productsIndexName } from '@edit-trace/utils';
import { ProductSerializer } from '../serializers';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class ProductsService {
  client: Redis;
  constructor(private elasticsearchService: ElasticsearchService, private redisService: RedisService) {
    this.client = this.redisService.getClient();
  }

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

  async find(from: number, size: number): Promise<ProductSerializer[]> {
    const {
      body: {
        hits: { hits },
      },
    } = await this.elasticsearchService.search({
      index: productsIndexName(),
      body: { from, size },
    });
    return hits.map((hit) => plainToClass(ProductSerializer, hit._source, { excludeExtraneousValues: true }));
  }
}
