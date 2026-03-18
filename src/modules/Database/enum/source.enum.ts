import { pgEnum } from 'drizzle-orm/pg-core';

export const sourceEnum = pgEnum('expenseSources', ['manual', 'photo']);
