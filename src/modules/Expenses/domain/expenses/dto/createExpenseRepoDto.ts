import { ExpenseSources } from '../expenseSources';

export interface CreateExpenseRepoDto {
  userId: string;
  amount: number;
  description: string;
  category: string;
  source: ExpenseSources;
  date: string;
}
