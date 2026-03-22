// recurring-expenses.mapper.ts
import { RecurringExpenseEntity } from './recurring-expense.entity';
import { ReturnRecurringExpenseDto } from './dto/returnRecurringExpenseDto';

export class RecurringExpensesMapper {
  static toReturnDto(
    entity: RecurringExpenseEntity,
  ): ReturnRecurringExpenseDto {
    return {
      id: entity.id,
      userId: entity.userId,
      amount: Number(entity.amount),
      merchant: entity.merchant,
      description: entity.description,
      category: entity.category,
      currency: entity.currency,
      dayOfMonth: entity.dayOfMonth,
      isActive: entity.isActive,
      lastGeneratedAt: entity.lastGeneratedAt,
      createdAt: entity.createdAt,
    };
  }
}
