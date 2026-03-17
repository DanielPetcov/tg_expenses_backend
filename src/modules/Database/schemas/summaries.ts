import { uuid } from 'drizzle-orm/pg-core';
import {
  pgTable,
  integer,
  decimal,
  jsonb,
  timestamp,
} from 'drizzle-orm/pg-core';

import { usersTable } from './users.schema';

export const summariesTable = pgTable('summaries', {
  id: uuid().defaultRandom().primaryKey(),

  userId: uuid()
    .references(() => usersTable.id)
    .notNull(),

  year: integer().notNull(),
  month: integer().notNull(), // 1-12

  totalAmount: decimal().notNull(),
  transactionCount: integer().notNull(),
  categoryBreakdown: jsonb().notNull(), // { food: 850, transport: 600, ... }

  createdAt: timestamp().defaultNow().notNull(),
});
