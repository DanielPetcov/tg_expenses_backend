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
      merchant: drizzleEntity.merchant,
      description: drizzleEntity.description,
      category: drizzleEntity.category,
      source: drizzleEntity.source,
      date: drizzleEntity.date,
      currency: drizzleEntity.currency,
      tags: drizzleEntity.tags,
      isRecurring: drizzleEntity.isRecurring,
    };
  }

  static CreateExpenseRepoFromCreateExpense(
    dto: CreateExpenseDto,
    userId: string,
  ): CreateExpenseRepoDto {
    return {
      userId: userId,
      amount: dto.amount,
      merchant: dto.merchant,
      category: dto.category,
      date: dto.date,
      description: dto.description,
      source: dto.source,
    };
  }
}
