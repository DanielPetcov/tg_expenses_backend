import { ReturnExpenseDto } from 'src/modules/Expenses/domain/expenses/dto/returnExpense.dto';

export function sortExpenses(
  expenses: ReturnExpenseDto[],
  descending?: boolean,
) {
  if (descending === true) {
    expenses.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    return;
  }

  expenses.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
