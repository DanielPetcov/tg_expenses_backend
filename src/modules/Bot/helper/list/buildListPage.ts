import { ReturnExpenseDto } from 'src/modules/Expenses/domain/expenses/dto/returnExpense.dto';
import { buildPaginationKeyboard } from '../keyboard/buildPaginationKeyboard';
import { createListMessage } from './createListMessage';

export function buildListPage(
  expenses: ReturnExpenseDto[],
  currentPage: number,
  pageSize: number,
) {
  const start = currentPage * pageSize;
  const pageExpenses = expenses.slice(start, start + pageSize);
  const message = createListMessage(pageExpenses, currentPage);
  const keyboard = buildPaginationKeyboard(
    currentPage,
    pageSize,
    expenses.length,
    pageExpenses,
  );
  return { message, keyboard, pageExpenses };
}
