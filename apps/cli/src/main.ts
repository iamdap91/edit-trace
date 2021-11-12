/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { CliModule } from './cli.module';

async function bootstrap() {
  console.time('cli');
  const app = await NestFactory.create(CliModule);
  console.timeEnd('cli');
  Logger.log('Done!');
}

bootstrap();
