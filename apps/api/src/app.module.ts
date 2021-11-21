import { Module } from '@nestjs/common';
import { ConfigElasticsearchModule } from '@edit-trace/config/elasticsearch';
import { ConfigRedisModule } from '@edit-trace/config/redis';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [ConfigElasticsearchModule, ConfigRedisModule, ProductsModule],
})
export class AppModule {}
