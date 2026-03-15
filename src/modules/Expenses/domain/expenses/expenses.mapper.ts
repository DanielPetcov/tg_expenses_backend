import { CreateExpenseDto } from './dto/createExpense.dto';
import { CreateExpenseRepoDto } from './dto/createExpenseRepoDto';
import { ReturnExpenseDto } from './dto/returnExpense.dto';
import { ExpenseEntity } from './expenses.entity';

export class ExpensesMapper {
  static ReturnDtoFromDrizzle(drizzleEntity: ExpenseEntity): ReturnExpenseDto {
    return {
      id: drizzleEntity.id,
      userId: drizzleEntity.userId,
      amount: Number(drizzleEntity.amount),
      description: drizzleEntity.description,
      category: drizzleEntity.category,
      createdAt: new Date(drizzleEntity.createdAt),
      date: drizzleEntity.date,
      source: drizzleEntity.source,
    };
  }

  static CreateExpenseRepoFromCreateExpense(
    dto: CreateExpenseDto,
    userId: string,
  ): CreateExpenseRepoDto {
    return {
      userId: userId,
      amount: dto.amount,
      category: dto.category,
      date: dto.date,
      description: dto.description,
      source: dto.source,
    };
  }
}
