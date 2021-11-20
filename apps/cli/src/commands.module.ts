import { Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { ConfigElasticsearchModule } from '@edit-trace/config/elasticsearch';
import { ConfigRedisModule } from '@edit-trace/config/redis';
import { EngineService, EsCommandService } from './commands';

export const services = [EngineService, EsCommandService];

@Module({
  imports: [ConsoleModule, ConfigElasticsearchModule, ConfigRedisModule],
  providers: services,
  exports: services,
})
export class CommandsModule {}
