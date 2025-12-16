import { Pool } from 'pg';

export async function query<T = any>(
  pool: Pool,
  sql: string,
  params?: any[],
): Promise<T[]> {
  const client = await pool.connect();

  try {
    const { rows } = await client.query<T>(sql, params);
    return rows;
  } finally {
    client.release();
  }
}
