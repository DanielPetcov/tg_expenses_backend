import { ExpenseCategory } from '../expenseCategory';
import { ExpenseSources } from '../expenseSources';

export interface ReturnExpenseDto {
  id: string;
  userId: string;
  amount: number;
  merchant: string | null;
  description: string | null;
  category: ExpenseCategory;
  source: ExpenseSources;
  date: string;
  currency: string;
  tags: string[] | null;
  isRecurring: boolean;
}
