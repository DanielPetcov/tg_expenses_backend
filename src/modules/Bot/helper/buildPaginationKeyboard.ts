import { InlineKeyboard } from 'grammy';
import { ReturnExpenseDto } from 'src/modules/Expenses/domain/expenses/dto/returnExpense.dto';

export function buildPaginationKeyboard(
  currentPage: number,
  pageSize: number,
  totalItems: number,
  pageExpenses: ReturnExpenseDto[],
) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const keyboard = new InlineKeyboard();

  pageExpenses.forEach((exp, index) => {
    keyboard.text(`🗑️ Delete #${index + 1}`, `delete:${exp.id}`).row();
  });

  currentPage > 0 ? keyboard.text('⬅️ Prev', 'prev') : keyboard.text('⬅️ Prev');

  currentPage < totalPages - 1
    ? keyboard.text('Next ➡️', 'next')
    : keyboard.text('Next ➡️');

  return keyboard;
}
