import { CreateExpenseRepoDto } from '../../domain/expenses/dto/createExpenseRepoDto';
import { ReturnExpenseDto } from '../../domain/expenses/dto/returnExpense.dto';
import { MonthlySummary } from '../../domain/summary/summary.model';

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
}
