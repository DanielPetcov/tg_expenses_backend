import { CreateExpenseRepoDto } from '../../domain/expenses/dto/createExpenseRepoDto';
import { ReturnExpenseDto } from '../../domain/expenses/dto/returnExpense.dto';
import { MonthlySummary } from '../../domain/summary/summary.model';

import { CreateRecurringExpenseDto } from '../../domain/expenses/dto/createRecurringExpenseDto';
import { ReturnRecurringExpenseDto } from '../../domain/expenses/dto/returnRecurringExpenseDto';

export abstract class IExpensesRepository {
  abstract create(createDto: CreateExpenseRepoDto): Promise<ReturnExpenseDto>;
  abstract getAll(userId: string): Promise<ReturnExpenseDto[]>;
  abstract getById(
    id: string,
    userId: string,
  ): Promise<ReturnExpenseDto | null>;
  abstract delete(id: string, userId: string): Promise<ReturnExpenseDto>;
  abstract exists(id: string, userId: string): Promise<boolean>;
  abstract getByMonth(
    userId: string,
    targetYear: number,
    targetMonth: number,
  ): Promise<ReturnExpenseDto[]>;
  abstract upsertSummary(
    userId: string,
    targetYear: number,
    targetMonth: number,
    summary: MonthlySummary,
  ): Promise<void>;

  // create a recurring template
  abstract createRecurring(
    dto: CreateRecurringExpenseDto,
    userId: string,
  ): Promise<void>;

  // get all active recurring expenses for a user (for a /recurring list command)
  abstract getRecurring(userId: string): Promise<ReturnRecurringExpenseDto[]>;

  // pause/resume a recurring expense
  abstract toggleRecurring(id: string, userId: string): Promise<void>;

  // delete a recurring template
  abstract deleteRecurring(id: string, userId: string): Promise<void>;

  // called by cron job — generates actual expenses for today
  abstract generateRecurringExpenses(): Promise<void>;
}
