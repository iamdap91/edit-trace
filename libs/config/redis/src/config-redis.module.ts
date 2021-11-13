import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: async () => ({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process?.env?.REDIS_PORT || '6379'),
      }),
    }),
  ],
  exports: [RedisModule],
})
export class ConfigRedisModule {}
