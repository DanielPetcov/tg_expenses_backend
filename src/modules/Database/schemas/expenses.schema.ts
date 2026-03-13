import { timestamp } from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';
import {
  pgTable,
  uuid,
  decimal,
  text,
  varchar,
  date,
} from 'drizzle-orm/pg-core';

export const sourceEnum = pgEnum('expenseSources', ['manual', 'photo']);

export const expensesTable = pgTable('expenses', {
  id: uuid().defaultRandom().primaryKey(),
  amount: decimal().notNull(),
  description: text().notNull(),
  category: varchar({ length: 50 }).notNull(),
  source: sourceEnum().notNull(),
  date: date().notNull(), // date of expense,
  createdAt: timestamp().defaultNow().notNull(),
});
