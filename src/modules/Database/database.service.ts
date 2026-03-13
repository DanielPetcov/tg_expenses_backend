import { Injectable } from '@nestjs/common';

import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from './schemas';

@Injectable()
export class DatabaseService {
  private readonly pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  public readonly db = drizzle({
    client: this.pool,
    schema,
    casing: 'snake_case',
  });
}
