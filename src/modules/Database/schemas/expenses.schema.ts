import { timestamp } from 'drizzle-orm/pg-core';
import { pgEnum } from 'drizzle-orm/pg-core';
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

export const sourceEnum = pgEnum('expenseSources', ['manual', 'photo']);

export const expensesTable = pgTable('expenses', {
  id: uuid().defaultRandom().primaryKey(),

  userId: uuid()
    .references(() => usersTable.id)
    .notNull(),

  amount: decimal().notNull(),
  description: text().notNull(),
  category: varchar({ length: 50 }).notNull(),
  source: sourceEnum().notNull(),
  date: date().notNull(), // date of expense,

  currency: varchar({ length: 3 }).default('MDL').notNull(), // future-proofing
  tags: text().array(), // e.g. ['work', 'recurring']
  isRecurring: boolean().default(false).notNull(), // rent, subscriptions
  note: text(), // optional extra context beyond description

  createdAt: timestamp().defaultNow().notNull(),
});
