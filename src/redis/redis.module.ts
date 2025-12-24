import { Global, Module } from '@nestjs/common';
import { redisProvider } from './redis.provider';

@Global()
@Module({
  imports: [],
  providers: [redisProvider],
  controllers: [],
  exports: [redisProvider],
})
export class RedisModule {}
