import { timestamp } from 'drizzle-orm/pg-core';
import {
  pgTable,
  uuid,
  decimal,
  text,
  varchar,
  date,
  boolean,
} from 'drizzle-orm/pg-core';
import { usersTable } from './users.schema';
import { categoryEnum } from '../enum/category.enum';
import { sourceEnum } from '../enum/source.enum';

export const expensesTable = pgTable('expenses', {
  id: uuid().defaultRandom().primaryKey(),

  userId: uuid()
    .references(() => usersTable.id)
    .notNull(),

  amount: decimal().notNull(),
  merchant: varchar({ length: 100 }), // from receipt, optional for manual
  description: text(), // optional, extra context
  category: categoryEnum().notNull(), // now enum, not free text
  source: sourceEnum().notNull(),
  date: date().notNull(),

  currency: varchar({ length: 3 }).default('MDL').notNull(),
  tags: text().array(),
  isRecurring: boolean().default(false).notNull(),

  createdAt: timestamp().defaultNow().notNull(),
});
