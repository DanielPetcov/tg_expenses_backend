import { and, eq, gte, lte } from 'drizzle-orm';
import { DatabaseService } from '../../../Database/database.service';
import { expensesTable } from '../../../Database/schemas';
import { ReturnExpenseDto } from '../../domain/expenses/dto/returnExpense.dto';
import { ExpenseEntity } from '../../domain/expenses/expenses.entity';
import { ExpensesMapper } from '../../domain/expenses/expenses.mapper';
import { IExpensesRepository } from './expenses.repository.interface';
import { Injectable } from '@nestjs/common';
import { getSingleOrError } from '../../common/getSingleOrError';
import { CreateExpenseRepoDto } from '../../domain/expenses/dto/createExpenseRepoDto';
import { MonthlySummary } from '../../domain/summary/summary.model';
import { summariesTable } from 'src/modules/Database/schemas/summaries.schema';
import { CreateRecurringExpenseDto } from '../../domain/expenses/dto/createRecurringExpenseDto';
import { ReturnRecurringExpenseDto } from '../../domain/expenses/dto/returnRecurringExpenseDto';
import { RecurringExpenseEntity } from '../../domain/expenses/recurring-expense.entity';
import { recurringExpensesTable } from 'src/modules/Database/schemas/recurring-expenses.schema';
import { RecurringExpensesMapper } from '../../domain/expenses/recurring-expenses.mapper';

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
        merchant: createDto.merchant,
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

  async getByMonth(userId: string, targetYear: number, targetMonth: number) {
    const startDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;

    const lastDay = new Date(targetYear, targetMonth, 0).getDate();
    const endDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    const expenses: ExpenseEntity[] = await this._db.db
      .select()
      .from(expensesTable)
      .where(
        and(
          eq(expensesTable.userId, userId),
          gte(expensesTable.date, startDate),
          lte(expensesTable.date, endDate),
        ),
      );

    return expenses.map((e) => ExpensesMapper.ReturnDtoFromDrizzle(e));
  }

  async upsertSummary(
    userId: string,
    targetYear: number,
    targetMonth: number,
    summary: MonthlySummary,
  ): Promise<void> {
    await this._db.db
      .insert(summariesTable)
      .values({
        userId,
        year: targetYear,
        month: targetMonth,
        totalAmount: summary.totalAmount.toString(),
        transactionCount: summary.transactionCount,
        dailyAverage: summary.dailyAverage.toString(),
        recurringTotal: summary.recurringTotal.toString(),
        categoryBreakdown: summary.categoryBreakdown,
        topMerchants: summary.topMerchants,
        largestExpense: summary.largestExpense,
      })
      .onConflictDoUpdate({
        target: [
          summariesTable.userId,
          summariesTable.year,
          summariesTable.month,
        ],
        set: {
          totalAmount: summary.totalAmount.toString(),
          transactionCount: summary.transactionCount,
          dailyAverage: summary.dailyAverage.toString(),
          recurringTotal: summary.recurringTotal.toString(),
          categoryBreakdown: summary.categoryBreakdown,
          topMerchants: summary.topMerchants,
          largestExpense: summary.largestExpense,
          updatedAt: new Date(),
        },
      });
  }

  // recurring expenses
  async createRecurring(
    dto: CreateRecurringExpenseDto,
    userId: string,
  ): Promise<void> {
    await this._db.db.insert(recurringExpensesTable).values({
      userId,
      amount: dto.amount.toString(),
      merchant: dto.merchant ?? null, // ← explicit null if undefined
      description: dto.description ?? null, // ← explicit null if undefined
      category: dto.category,
      currency: dto.currency ?? 'MDL',
      dayOfMonth: dto.dayOfMonth,
    });
  }

  async getRecurring(userId: string): Promise<ReturnRecurringExpenseDto[]> {
    const rows: RecurringExpenseEntity[] = await this._db.db
      .select()
      .from(recurringExpensesTable)
      .where(eq(recurringExpensesTable.userId, userId));

    return rows.map((r) => RecurringExpensesMapper.toReturnDto(r));
  }

  async toggleRecurring(id: string, userId: string): Promise<void> {
    // first get current state
    const rows: RecurringExpenseEntity[] = await this._db.db
      .select()
      .from(recurringExpensesTable)
      .where(
        and(
          eq(recurringExpensesTable.id, id),
          eq(recurringExpensesTable.userId, userId),
        ),
      );

    const current = getSingleOrError(rows, 'Recurring expense not found');

    await this._db.db
      .update(recurringExpensesTable)
      .set({ isActive: !current.isActive })
      .where(
        and(
          eq(recurringExpensesTable.id, id),
          eq(recurringExpensesTable.userId, userId),
        ),
      );
  }

  async deleteRecurring(id: string, userId: string): Promise<void> {
    await this._db.db
      .delete(recurringExpensesTable)
      .where(
        and(
          eq(recurringExpensesTable.id, id),
          eq(recurringExpensesTable.userId, userId),
        ),
      );
  }

  async generateRecurringExpenses(): Promise<void> {
    const today = new Date().getDate();

    const due: RecurringExpenseEntity[] = await this._db.db
      .select()
      .from(recurringExpensesTable)
      .where(
        and(
          eq(recurringExpensesTable.isActive, true),
          eq(recurringExpensesTable.dayOfMonth, today),
        ),
      );

    for (const recurring of due) {
      await this.create({
        userId: recurring.userId,
        amount: Number(recurring.amount),
        merchant: recurring.merchant ?? undefined,
        description: recurring.description ?? undefined,
        category: recurring.category,
        currency: recurring.currency,
        source: 'manual',
        date: new Date().toISOString().split('T')[0],
        isRecurring: true,
      });

      await this._db.db
        .update(recurringExpensesTable)
        .set({ lastGeneratedAt: new Date() })
        .where(eq(recurringExpensesTable.id, recurring.id));
    }
  }
}
