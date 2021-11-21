import { Redis } from 'ioredis';
import { RedisService } from 'nestjs-redis';
import { plainToClass } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { productsIndexName } from '@edit-trace/utils';

import { ProductSerializer, RakutenProductSerializer } from '../serializers';

@Injectable()
export class ProductsService {
  client: Redis;
  constructor(private elasticsearchService: ElasticsearchService, private redisService: RedisService) {
    this.client = this.redisService.getClient();
  }

  async findOne(productId: string): Promise<ProductSerializer> {
    const cachedProduct = await this.client.hget('product', productId);
    if (cachedProduct) return { cached: true, product: JSON.parse(cachedProduct) };

    const { body } = await this.elasticsearchService.get({
      index: productsIndexName(),
      id: productId,
    });

    return {
      cached: false,
      product: plainToClass(ProductSerializer, { product: body._source }, { excludeExtraneousValues: true }),
    };
  }

  async findOneHistory(productId: string): Promise<RakutenProductSerializer[]> {
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

    return hits.map((hit) => plainToClass(RakutenProductSerializer, hit._source, { excludeExtraneousValues: true }));
  }

  async find(from: number, size: number): Promise<RakutenProductSerializer[]> {
    const {
      body: {
        hits: { hits },
      },
    } = await this.elasticsearchService.search({
      index: productsIndexName(),
      body: { from, size },
    });
    return hits.map((hit) => plainToClass(RakutenProductSerializer, hit._source, { excludeExtraneousValues: true }));
  }
}
