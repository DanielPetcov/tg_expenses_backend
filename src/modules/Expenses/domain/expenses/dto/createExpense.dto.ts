import { ExpenseSources } from '../expenseSources';

export interface CreateExpenseDto {
  amount: number;
  description: string;
  category: string;
  source: ExpenseSources;
  date: string;
}
