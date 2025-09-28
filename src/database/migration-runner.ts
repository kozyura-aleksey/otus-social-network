import { Client } from 'pg';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

async function runMigrations() {
  const configService = new ConfigService();
  const client = new Client({
    host: configService.get('POSTGRES_HOST') ?? 'localhost',
    port: Number(configService.get('POSTGRES_PORT')) ?? 5432,
    user: configService.get('POSTGRES_USER') ?? 'postgres',
    password: configService.get('POSTGRES_PASSWORD') ?? 'postgres',
    database: configService.get('POSTGRES_DB') ?? 'social_network_db',
  });

  await client.connect();

  // таблица для учёта применённых миграций
  await client.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      applied_at TIMESTAMP DEFAULT now()
    )
  `);

  const dir = join(__dirname, '../database/migrations');
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const { rowCount } = await client.query(
      'SELECT 1 FROM migrations WHERE name = $1',
      [file],
    );

    if (rowCount === 0) {
      const sql = readFileSync(join(dir, file), 'utf8');
      console.log(`⏳ Выполняю миграцию: ${file}`);
      await client.query(sql);
      await client.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
      console.log(`Применена: ${file}`);
    }
  }

  await client.end();
}

runMigrations().catch((err) => {
  console.error('Ошибка миграции:', err);
  process.exit(1);
});
