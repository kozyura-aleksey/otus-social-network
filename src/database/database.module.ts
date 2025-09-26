import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'PG_POOL',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Pool({
          host: configService.get('POSTGRES_HOST') ?? 'localhost',
          port: Number(configService.get('POSTGRES_PORT')) ?? 5432,
          user: configService.get('POSTGRES_USER') ?? 'postgres',
          password: configService.get('POSTGRES_PASSWORD') ?? 'postgres',
          database: configService.get('POSTGRES_DB') ?? 'postgres',
        });
      },
    },
  ],
  exports: ['PG_POOL'],
})
export class DatabaseModule {}
