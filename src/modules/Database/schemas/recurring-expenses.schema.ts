import {
  pgTable,
  uuid,
  decimal,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core';
import { usersTable } from './users.schema';
import { categoryEnum } from '../enum/category.enum';

export const recurringExpensesTable = pgTable('recurring_expenses', {
  id: uuid().defaultRandom().primaryKey(),

  userId: uuid()
    .references(() => usersTable.id)
    .notNull(),

  amount: decimal().notNull(),
  merchant: varchar({ length: 100 }),
  description: text(),
  category: categoryEnum().notNull(),
  currency: varchar({ length: 3 }).default('MDL').notNull(),

  dayOfMonth: integer().notNull().default(1),

  isActive: boolean().default(true).notNull(),

  lastGeneratedAt: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
});
