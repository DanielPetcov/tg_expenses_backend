import { ExpenseCategory } from '../expenseCategory';

export interface ReturnRecurringExpenseDto {
  id: string;
  userId: string;
  amount: number;
  merchant: string | null;
  description: string | null;
  category: ExpenseCategory;
  currency: string;
  dayOfMonth: number;
  isActive: boolean;
  lastGeneratedAt: Date | null;
  createdAt: Date;
}
