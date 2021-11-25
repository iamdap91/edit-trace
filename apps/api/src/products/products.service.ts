import { Redis } from 'ioredis';
import { RedisService } from 'nestjs-redis';
import { plainToClass } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { productsIndexName } from '@edit-trace/utils';
import { CachedProductSerializer, ProductSerializer } from '@edit-trace/models';

@Injectable()
export class ProductsService {
  client: Redis;
  constructor(private elasticsearchService: ElasticsearchService, private redisService: RedisService) {
    this.client = this.redisService.getClient();
  }

  async findOne(productId: string): Promise<CachedProductSerializer> {
    const cachedProduct = await this.client.hget('product', productId);
    if (cachedProduct) return { cached: true, product: JSON.parse(cachedProduct) };

    return { cached: false, product: null };
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
