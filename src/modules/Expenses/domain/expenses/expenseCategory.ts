export const ExpenseCategories = [
  'food',
  'transport',
  'health',
  'utilities',
  'shopping',
  'entertainment',
  'other',
] as const;

export type ExpenseCategory = (typeof ExpenseCategories)[number];

export const categoryEmojis: Record<ExpenseCategory, string> = {
  food: '🍔',
  transport: '🚗',
  health: '💊',
  utilities: '💡',
  shopping: '🛍️',
  entertainment: '🎬',
  other: '📦',
};
