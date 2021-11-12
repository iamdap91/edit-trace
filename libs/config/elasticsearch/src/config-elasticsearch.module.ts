import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigService } from './config/config.service';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useExisting: ConfigService,
    }),
  ],
  exports: [ElasticsearchModule],
})
export class ConfigElasticsearchModule {}
