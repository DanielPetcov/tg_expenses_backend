import { ExpenseCategory } from '../expenseCategory';
import { ExpenseSources } from '../expenseSources';

export interface CreateExpenseRepoDto {
  userId: string;
  amount: number;
  merchant: string | undefined;
  description: string | undefined;
  category: ExpenseCategory;
  source: ExpenseSources;
  date: string;
  currency: string | undefined;
  isRecurring: boolean | undefined;
}
