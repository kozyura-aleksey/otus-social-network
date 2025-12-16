import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'PG_POOL_MASTER',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Pool({
          host: configService.get('POSTGRES_HOST') ?? 'localhost',
          port: Number(configService.get('POSTGRES_MASTER_PORT')) ?? 5432,
          user: configService.get('POSTGRES_USER') ?? 'postgres',
          password: configService.get('POSTGRES_PASSWORD') ?? 'postgres',
          database: configService.get('POSTGRES_DB') ?? 'social_network_db',
        });
      },
    },
    {
      provide: 'PG_POOL_SLAVE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Pool({
          host: configService.get('POSTGRES_HOST') ?? 'localhost',
          port: Number(configService.get('POSTGRES_SLAVE_PORT')) ?? 15432,
          user: configService.get('POSTGRES_USER') ?? 'postgres',
          password: configService.get('POSTGRES_PASSWORD') ?? 'postgres',
          database: configService.get('POSTGRES_DB') ?? 'social_network_db',
        });
      },
    },
    {
      provide: 'PG_POOL_SLAVE_SECOND',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new Pool({
          host: configService.get('POSTGRES_HOST') ?? 'localhost',
          port:
            Number(configService.get('POSTGRES_SLAVE_SECOND_PORT')) ?? 25432,
          user: configService.get('POSTGRES_USER') ?? 'postgres',
          password: configService.get('POSTGRES_PASSWORD') ?? 'postgres',
          database: configService.get('POSTGRES_DB') ?? 'social_network_db',
        });
      },
    },
  ],
  exports: ['PG_POOL_MASTER', 'PG_POOL_SLAVE', 'PG_POOL_SLAVE_SECOND'],
})
export class DatabaseModule {}
