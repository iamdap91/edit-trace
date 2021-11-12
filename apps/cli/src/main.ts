import { BootstrapConsole } from 'nestjs-console';
import { Logger } from '@nestjs/common';

import { CommandsModule } from './commands.module';

const bootstrap = new BootstrapConsole({
  module: CommandsModule,
  useDecorators: true,
});

bootstrap.init().then(async (app) => {
  console.time('Run Time');
  try {
    await app.init();
    await bootstrap.boot();
    const memUsage = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    Logger.log(`Memory usage ${memUsage} MB`);
  } catch (e) {
    Logger.error(e);
  } finally {
    console.timeEnd('Run Time');
    await app.close();
    process.exit(0);
  }
});
