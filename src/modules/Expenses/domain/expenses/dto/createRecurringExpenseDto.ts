import { ExpenseCategory } from '../expenseCategory';

export interface CreateRecurringExpenseDto {
  amount: number;
  merchant?: string;
  description?: string;
  category: ExpenseCategory;
  dayOfMonth: number;
  currency?: string;
}
