import { Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { EngineService } from './engine.service';

@Module({
  imports: [ConsoleModule],
  providers: [EngineService],
  exports: [EngineService],
})
export class CommandsModule {}
