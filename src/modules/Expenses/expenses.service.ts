import { Inject, Injectable } from '@nestjs/common';
import { IExpensesRepository } from './repositories/expensesRepository/expenses.repository.interface';
import { CreateExpenseDto } from './domain/expenses/dto/createExpense.dto';
import { ReturnExpenseDto } from './domain/expenses/dto/returnExpense.dto';
import { EXPENSES_REPOSITORY } from './repositories/expensesRepository/expenses.repository.token';
import { USERS_REPOSITORY } from './repositories/usersRepository/users.repository.token';
import { IUsersRepository } from './repositories/usersRepository/users.repository.interface';
import { ExpensesMapper } from './domain/expenses/expenses.mapper';
import { RegisterUserDto } from './domain/users/dto/registerUserDto';
import {
  CategoryBreakdown,
  MonthlySummary,
  TopMerchant,
} from './domain/summary/summary.model';

@Injectable()
export class ExpensesService {
  constructor(
    @Inject(EXPENSES_REPOSITORY)
    private readonly expensesRepo: IExpensesRepository,
    @Inject(USERS_REPOSITORY)
    private readonly usersRepo: IUsersRepository,
  ) {}

  async create(
    dto: CreateExpenseDto,
    telegramId: number,
  ): Promise<ReturnExpenseDto> {
    const user = await this.usersRepo.findByTelegramId(telegramId);

    if (!user) {
      throw new Error('User could not be found. /start the bot.');
    }

    const createdExpense = await this.expensesRepo.create(
      ExpensesMapper.CreateExpenseRepoFromCreateExpense(dto, user.id),
    );
    return createdExpense;
  }

  async getAll(telegramId: number): Promise<ReturnExpenseDto[]> {
    const user = await this.usersRepo.findByTelegramId(telegramId);

    if (!user) {
      throw new Error('User could not be found. /start the bot.');
    }

    const expenses = await this.expensesRepo.getAll(user.id);
    return expenses;
  }

  async getById(
    id: string,
    telegramId: number,
  ): Promise<ReturnExpenseDto | null> {
    const user = await this.usersRepo.findByTelegramId(telegramId);

    if (!user) {
      throw new Error('User could not be found. /start the bot.');
    }

    const expense = await this.expensesRepo.getById(id, user.id);
    return expense;
  }

  async delete(id: string, telegramId: number): Promise<ReturnExpenseDto> {
    const user = await this.usersRepo.findByTelegramId(telegramId);

    if (!user) {
      throw new Error('User could not be found. /start the bot.');
    }

    const existsExpense = await this.expensesRepo.exists(id, user.id);
    if (!existsExpense) throw new Error('Expense was not found');

    const deletedExpense = await this.expensesRepo.delete(id, user.id);
    return deletedExpense;
  }

  async userExists(telegramId: number) {
    const userExists = await this.usersRepo.findByTelegramId(telegramId);

    return userExists;
  }

  async registerUser(dto: RegisterUserDto) {
    const user = await this.usersRepo.registerUser(
      dto.telegramId,
      dto.username,
    );

    return user;
  }

  async summary(
    telegramId: number,
    year?: number,
    month?: number,
  ): Promise<MonthlySummary | null> {
    const user = await this.usersRepo.findByTelegramId(telegramId);

    if (!user) {
      throw new Error('User could not be found. /start the bot.');
    }

    const userId = user.id;

    const now = new Date();
    const targetYear = year ?? now.getFullYear();
    const targetMonth = month ?? now.getMonth() + 1;

    // fetch all expenses for that month
    const expenses = await this.expensesRepo.getByMonth(
      userId,
      targetYear,
      targetMonth,
    );

    if (expenses.length === 0) return null;

    // calculate category breakdown
    const categoryBreakdown: CategoryBreakdown = {};
    for (const exp of expenses) {
      const amount = Number(exp.amount);
      categoryBreakdown[exp.category] =
        (categoryBreakdown[exp.category] ?? 0) + amount;
    }

    // top category
    const topCategory = Object.entries(categoryBreakdown).sort(
      ([, a], [, b]) => b - a,
    )[0];

    // top merchants (only photo/merchant expenses)
    const merchantMap: Record<string, number> = {};
    for (const exp of expenses) {
      if (exp.merchant) {
        merchantMap[exp.merchant] =
          (merchantMap[exp.merchant] ?? 0) + Number(exp.amount);
      }
    }
    const topMerchants: TopMerchant[] = Object.entries(merchantMap)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);

    // largest single expense
    const largest = expenses.reduce((max, exp) =>
      Number(exp.amount) > Number(max.amount) ? exp : max,
    );

    const totalAmount = expenses.reduce(
      (sum, exp) => sum + Number(exp.amount),
      0,
    );
    const recurringTotal = expenses
      .filter((e) => e.isRecurring)
      .reduce((sum, exp) => sum + Number(exp.amount), 0);

    const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
    const dailyAverage = totalAmount / daysInMonth;

    const summary: MonthlySummary = {
      year: targetYear,
      month: targetMonth,
      totalAmount,
      transactionCount: expenses.length,
      dailyAverage,
      categoryBreakdown,
      topMerchants,
      largestExpense: {
        amount: Number(largest.amount),
        category: largest.category,
        merchant: largest.merchant ?? undefined,
        date: largest.date,
      },
      recurringTotal,
      topCategory: topCategory[0],
      topCategoryAmount: topCategory[1],
    };

    // save or update snapshot
    await this.expensesRepo.upsertSummary(
      userId,
      targetYear,
      targetMonth,
      summary,
    );

    return summary;
  }
}
