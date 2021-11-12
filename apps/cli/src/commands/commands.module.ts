import { Module } from '@nestjs/common';
import { EngineService } from './engine/engine.service';

@Module({
  providers: [EngineService],
  exports: [EngineService],
})
export class CommandsModule {}
