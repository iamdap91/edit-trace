import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ConfigElasticsearchModule } from '@edit-trace/config/elasticsearch';

@Module({
  imports: [ConfigElasticsearchModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
