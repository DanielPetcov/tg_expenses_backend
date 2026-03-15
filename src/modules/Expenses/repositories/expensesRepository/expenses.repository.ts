import { and, eq } from 'drizzle-orm';
import { DatabaseService } from '../../../Database/database.service';
import { expensesTable } from '../../../Database/schemas';
import { CreateExpenseDto } from '../../domain/expenses/dto/createExpense.dto';
import { ReturnExpenseDto } from '../../domain/expenses/dto/returnExpense.dto';
import { ExpenseEntity } from '../../domain/expenses/expenses.entity';
import { ExpensesMapper } from '../../domain/expenses/expenses.mapper';
import { IExpensesRepository } from './expenses.repository.interface';
import { Injectable } from '@nestjs/common';
import { getSingleOrError } from '../../common/getSingleOrError';
import { CreateExpenseRepoDto } from '../../domain/expenses/dto/createExpenseRepoDto';

@Injectable()
export class ExpensesRepository implements IExpensesRepository {
  constructor(private readonly _db: DatabaseService) {}
  async exists(id: string, userId: string): Promise<boolean> {
    const expense: { id: string }[] = await this._db.db
      .select({ id: expensesTable.id })
      .from(expensesTable)
      .where(and(eq(expensesTable.id, id), eq(expensesTable.userId, userId)));
    if (expense.length === 0) return false;
    return true;
  }

  async create(createDto: CreateExpenseRepoDto): Promise<ReturnExpenseDto> {
    const createdExpense: ExpenseEntity[] = await this._db.db
      .insert(expensesTable)
      .values({
        userId: createDto.userId,
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

  async getAll(userId: string): Promise<ReturnExpenseDto[]> {
    const returnedExpenses: ExpenseEntity[] = await this._db.db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, userId));

    return returnedExpenses.map((e) => ExpensesMapper.ReturnDtoFromDrizzle(e));
  }

  async getById(id: string, userId: string): Promise<ReturnExpenseDto | null> {
    const returnedExpenses: ExpenseEntity[] = await this._db.db
      .select()
      .from(expensesTable)
      .where(and(eq(expensesTable.id, id), eq(expensesTable.userId, userId)));

    if (returnedExpenses.length === 0) {
      return null;
    }

    return ExpensesMapper.ReturnDtoFromDrizzle(returnedExpenses[0]);
  }

  async delete(id: string, userId: string): Promise<ReturnExpenseDto> {
    const deletedExpense: ExpenseEntity[] = await this._db.db
      .delete(expensesTable)
      .where(and(eq(expensesTable.id, id), eq(expensesTable.userId, userId)))
      .returning();

    const expense = getSingleOrError(
      deletedExpense,
      'Expense could not be deleted',
    );

    return ExpensesMapper.ReturnDtoFromDrizzle(expense);
  }
}
