import { ExpenseSources } from './expenseSources';

export interface ExpenseEntity {
  id: string;
  userId: string;
  amount: string;
  description: string;
  category: string;
  source: ExpenseSources;
  date: string;
  createdAt: Date;
}
