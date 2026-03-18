import { pgEnum } from 'drizzle-orm/pg-core';

export const categoryEnum = pgEnum('expenseCategory', [
  'food',
  'transport',
  'health',
  'utilities',
  'shopping',
  'entertainment',
  'other',
]);
