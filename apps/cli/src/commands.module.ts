import { Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { EngineService, EsCommandService } from './commands';
import { ConfigElasticsearchModule } from '@edit-trace/config/elasticsearch';

export const services = [EngineService, EsCommandService];

@Module({
  imports: [ConsoleModule, ConfigElasticsearchModule],
  providers: services,
  exports: services,
})
export class CommandsModule {}
