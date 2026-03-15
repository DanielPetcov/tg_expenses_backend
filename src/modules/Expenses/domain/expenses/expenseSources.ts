export const ExpenseSources = ['manual', 'photo'] as const;
export type ExpenseSources = (typeof ExpenseSources)[number];
