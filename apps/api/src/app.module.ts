import { Module } from '@nestjs/common';
import { ConfigElasticsearchModule } from '@edit-trace/config/elasticsearch';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [ConfigElasticsearchModule, ProductsModule],
})
export class AppModule {}
