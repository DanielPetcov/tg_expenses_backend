import { ExpenseSources } from './expenseSources';
import { ExpenseCategory } from './expenseCategory';

export interface ExpenseEntity {
  id: string;
  userId: string;
  amount: string;
  merchant: string | null;
  description: string | null;
  category: ExpenseCategory;
  source: ExpenseSources;
  date: string;
  currency: string;
  tags: string[] | null;
  isRecurring: boolean;
  createdAt: Date;
}
