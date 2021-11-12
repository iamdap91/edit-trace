import { Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { EngineService, EsCommandService } from './commands';

export const services = [EngineService, EsCommandService];

@Module({
  imports: [ConsoleModule],
  providers: services,
  exports: services,
})
export class CommandsModule {}
