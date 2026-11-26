import dotenv from 'dotenv';
import pg from 'pg';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: fileURLToPath(new URL('../../../.env', import.meta.url)) });

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.DATABASE_URL?.includes('sslmode=require') ||
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});
