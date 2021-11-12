import { ElasticsearchModuleOptions, ElasticsearchOptionsFactory } from '@nestjs/elasticsearch';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService implements ElasticsearchOptionsFactory {
  createElasticsearchOptions(): ElasticsearchModuleOptions {
    return { node: process.env.ELASTICSEARCH_HOST || 'http://localhost:9200' };
  }
}
