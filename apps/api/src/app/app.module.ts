import { Module } from '@nestjs/common';

import { ConfigElasticsearchModule } from '@edit-trace/config/elasticsearch';

@Module({
  imports: [ConfigElasticsearchModule],
})
export class AppModule {}
