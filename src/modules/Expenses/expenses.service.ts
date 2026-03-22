import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
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
import { CreateRecurringExpenseDto } from './domain/expenses/dto/createRecurringExpenseDto';
import { ReturnRecurringExpenseDto } from './domain/expenses/dto/returnRecurringExpenseDto';

@Injectable()
export class ExpensesService {
  constructor(
    @Inject(EXPENSES_REPOSITORY)
    private readonly expensesRepo: IExpensesRepository,
    @Inject(USERS_REPOSITORY)
    private readonly usersRepo: IUsersRepository,
  ) {}

  private async resolveUser(telegramId: number) {
    const user = await this.usersRepo.findByTelegramId(telegramId);
    if (!user) throw new Error('User could not be found. /start the bot.');
    return user;
  }

  async create(
    dto: CreateExpenseDto,
    telegramId: number,
  ): Promise<ReturnExpenseDto> {
    const user = await this.resolveUser(telegramId);
    return this.expensesRepo.create(
      ExpensesMapper.CreateExpenseRepoFromCreateExpense(dto, user.id),
    );
  }

  async getAll(telegramId: number): Promise<ReturnExpenseDto[]> {
    const user = await this.resolveUser(telegramId);
    return this.expensesRepo.getAll(user.id);
  }

  async getById(
    id: string,
    telegramId: number,
  ): Promise<ReturnExpenseDto | null> {
    const user = await this.resolveUser(telegramId);
    return this.expensesRepo.getById(id, user.id);
  }

  async delete(id: string, telegramId: number): Promise<ReturnExpenseDto> {
    const user = await this.resolveUser(telegramId);
    const exists = await this.expensesRepo.exists(id, user.id);
    if (!exists) throw new Error('Expense was not found');
    return this.expensesRepo.delete(id, user.id);
  }

  async userExists(telegramId: number) {
    return this.usersRepo.findByTelegramId(telegramId);
  }

  async registerUser(dto: RegisterUserDto) {
    return this.usersRepo.registerUser(dto.telegramId, dto.username);
  }

  async summary(
    telegramId: number,
    year?: number,
    month?: number,
  ): Promise<MonthlySummary | null> {
    const user = await this.resolveUser(telegramId);
    const now = new Date();
    const targetYear = year ?? now.getFullYear();
    const targetMonth = month ?? now.getMonth() + 1;

    const expenses = await this.expensesRepo.getByMonth(
      user.id,
      targetYear,
      targetMonth,
    );
    if (expenses.length === 0) return null;

    const categoryBreakdown: CategoryBreakdown = {};
    for (const exp of expenses) {
      const amount = Number(exp.amount);
      categoryBreakdown[exp.category] =
        (categoryBreakdown[exp.category] ?? 0) + amount;
    }

    const topCategory = Object.entries(categoryBreakdown).sort(
      ([, a], [, b]) => b - a,
    )[0];

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

    const summary: MonthlySummary = {
      year: targetYear,
      month: targetMonth,
      totalAmount,
      transactionCount: expenses.length,
      dailyAverage: totalAmount / daysInMonth,
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

    await this.expensesRepo.upsertSummary(
      user.id,
      targetYear,
      targetMonth,
      summary,
    );
    return summary;
  }

  async createRecurring(
    dto: CreateRecurringExpenseDto,
    telegramId: number,
  ): Promise<void> {
    const user = await this.resolveUser(telegramId);
    await this.expensesRepo.createRecurring(dto, user.id);
  }

  async getRecurring(telegramId: number): Promise<ReturnRecurringExpenseDto[]> {
    const user = await this.resolveUser(telegramId);
    return this.expensesRepo.getRecurring(user.id);
  }

  async toggleRecurring(id: string, telegramId: number): Promise<void> {
    const user = await this.resolveUser(telegramId);
    await this.expensesRepo.toggleRecurring(id, user.id);
  }

  async deleteRecurring(id: string, telegramId: number): Promise<void> {
    const user = await this.resolveUser(telegramId);
    await this.expensesRepo.deleteRecurring(id, user.id);
  }

  @Cron('0 9 * * *') // every day at 9:00 AM
  async generateRecurringExpenses(): Promise<void> {
    console.log('Running recurring expenses generation...');
    await this.expensesRepo.generateRecurringExpenses();
    console.log('Recurring expenses generation complete.');
  }
}
