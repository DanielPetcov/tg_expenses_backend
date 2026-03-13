import { CreateExpenseDto } from './domain/dto/createExpense.dto';
import { ReturnExpenseDto } from './domain/dto/returnExpense.dto';

export abstract class IExpensesRepository {
  abstract create(createDto: CreateExpenseDto): Promise<ReturnExpenseDto>;
  abstract getAll(): Promise<ReturnExpenseDto[]>;
  abstract getById(id: string): Promise<ReturnExpenseDto | null>;
  abstract delete(id: string): Promise<ReturnExpenseDto>;
  abstract exists(id: string): Promise<boolean>;
}
