import { eq } from 'drizzle-orm';
import { DatabaseService } from '../Database/database.service';
import { expensesTable } from '../Database/schemas';
import { CreateExpenseDto } from './domain/dto/createExpense.dto';
import { ReturnExpenseDto } from './domain/dto/returnExpense.dto';
import { ExpensesEntity } from './domain/expenses.entity';
import { ExpensesMapper } from './domain/expenses.mapper';
import { IExpensesRepository } from './expenses.repository.interface';
import { Injectable } from '@nestjs/common';

function getSingleOrError<T>(entityArray: T[], errorMessage: string) {
  const entity = entityArray[0];
  if (!entity) {
    throw new Error(errorMessage);
  }
  return entity;
}

@Injectable()
export class ExpensesRepository implements IExpensesRepository {
  constructor(private readonly _db: DatabaseService) {}
  async exists(id: string): Promise<boolean> {
    const expense: { id: string }[] = await this._db.db
      .select({ id: expensesTable.id })
      .from(expensesTable);
    if (expense.length === 0) return false;
    return true;
  }
  async create(createDto: CreateExpenseDto): Promise<ReturnExpenseDto> {
    const createdExpense: ExpensesEntity[] = await this._db.db
      .insert(expensesTable)
      .values({
        amount: createDto.amount.toString(),
        description: createDto.description,
        category: createDto.category,
        source: createDto.source,
        date: createDto.date,
      })
      .returning();

    const expense = getSingleOrError(
      createdExpense,
      'Could not create expense',
    );
    return ExpensesMapper.ReturnDtoFromDrizzle(expense);
  }

  async getAll(): Promise<ReturnExpenseDto[]> {
    const returnedExpenses: ExpensesEntity[] = await this._db.db
      .select()
      .from(expensesTable);

    return returnedExpenses.map((e) => ExpensesMapper.ReturnDtoFromDrizzle(e));
  }
  async getById(id: string): Promise<ReturnExpenseDto | null> {
    const returnedExpenses: ExpensesEntity[] = await this._db.db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.id, id));

    if (returnedExpenses.length === 0) {
      return null;
    }

    return ExpensesMapper.ReturnDtoFromDrizzle(returnedExpenses[0]);
  }
  async delete(id: string): Promise<ReturnExpenseDto> {
    const deletedExpense: ExpensesEntity[] = await this._db.db
      .delete(expensesTable)
      .where(eq(expensesTable.id, id))
      .returning();

    const expense = getSingleOrError(
      deletedExpense,
      'Expense could not be deleted',
    );

    return ExpensesMapper.ReturnDtoFromDrizzle(expense);
  }
}
