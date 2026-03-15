import { pgTable, uuid, varchar, bigint, timestamp } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: uuid().defaultRandom().primaryKey(),
  telegramId: bigint({ mode: 'number' }).notNull().unique(),
  username: varchar({ length: 100 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
});
