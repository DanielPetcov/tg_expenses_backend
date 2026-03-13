import { ReturnExpenseDto } from './dto/returnExpense.dto';
import { ExpensesEntity } from './expenses.entity';

export class ExpensesMapper {
  static ReturnDtoFromDrizzle(drizzleEntity: ExpensesEntity): ReturnExpenseDto {
    return {
      id: drizzleEntity.id,
      amount: Number(drizzleEntity.amount),
      description: drizzleEntity.description,
      category: drizzleEntity.category,
      createdAt: new Date(drizzleEntity.createdAt),
      date: drizzleEntity.date,
      source: drizzleEntity.source,
    };
  }
}
