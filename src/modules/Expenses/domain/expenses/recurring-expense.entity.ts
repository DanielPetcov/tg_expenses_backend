// recurring-expense.entity.ts
import { ExpenseCategory } from './expenseCategory';

export interface RecurringExpenseEntity {
  id: string;
  userId: string;
  amount: string; // drizzle returns decimal as string
  merchant: string | null;
  description: string | null;
  category: ExpenseCategory;
  currency: string;
  dayOfMonth: number;
  isActive: boolean;
  lastGeneratedAt: Date | null;
  createdAt: Date;
}
