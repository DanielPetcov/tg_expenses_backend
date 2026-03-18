import { ExpenseSources } from '../expenseSources';
import { ExpenseCategory } from '../expenseCategory';

export interface CreateExpenseDto {
  amount: number;
  merchant?: string;
  description?: string;
  category: ExpenseCategory;
  source: ExpenseSources;
  date: string;
  currency?: string;
  isRecurring?: boolean;
}
