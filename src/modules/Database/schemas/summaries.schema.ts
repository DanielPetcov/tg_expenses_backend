import { uuid } from 'drizzle-orm/pg-core';
import {
  pgTable,
  integer,
  decimal,
  jsonb,
  timestamp,
} from 'drizzle-orm/pg-core';

import { usersTable } from './users.schema';
import { unique } from 'drizzle-orm/pg-core';

export const summariesTable = pgTable(
  'summaries',
  {
    id: uuid().defaultRandom().primaryKey(),

    userId: uuid()
      .references(() => usersTable.id)
      .notNull(),

    year: integer().notNull(),
    month: integer().notNull(),

    totalAmount: decimal().notNull(),
    transactionCount: integer().notNull(),
    categoryBreakdown: jsonb().notNull(), // { food: 850, transport: 600 }
    topMerchants: jsonb().notNull().default([]), // [{ name: 'Lidl', total: 300 }]
    dailyAverage: decimal().notNull(),
    largestExpense: jsonb().notNull(), // { amount: 500, category: 'food', merchant: 'X' }
    recurringTotal: decimal().notNull().default('0'), // sum of isRecurring expenses

    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
  },
  (table) => [unique().on(table.userId, table.year, table.month)],
);
