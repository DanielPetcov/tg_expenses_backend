import { ExpenseSources } from '../expenseSources';

export interface ReturnExpenseDto {
  id: string;
  userId: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  source: ExpenseSources;
  createdAt: Date | null;
}
