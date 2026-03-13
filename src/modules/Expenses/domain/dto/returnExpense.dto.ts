import { ExpenseSources } from '../expenseSources';

export interface ReturnExpenseDto {
  date: string;
  id: string;
  amount: number;
  description: string;
  category: string;
  source: ExpenseSources;
  createdAt: Date | null;
}
