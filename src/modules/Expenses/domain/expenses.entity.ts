import { ExpenseSources } from './expenseSources';

export interface ExpensesEntity {
  id: string;
  amount: string;
  description: string;
  category: string;
  source: ExpenseSources;
  date: string;
  createdAt: Date;
}
