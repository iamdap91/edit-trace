import { Module } from '@nestjs/common';
import { ConsoleModule } from 'nestjs-console';
import { CommandsModule } from './commands/commands.module';

@Module({
  imports: [ConsoleModule, CommandsModule],
})
export class CliModule {}
