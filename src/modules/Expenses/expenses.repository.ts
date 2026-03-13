import { DatabaseService } from '../Database/database.service';
import { IExpensesRepository } from './expenses.repository.interface';

export class ExpensesRepository implements IExpensesRepository {
  constructor(private readonly _db: DatabaseService) {}

  createExpense() {
    throw new Error('Method not implemented.');
  }
}
