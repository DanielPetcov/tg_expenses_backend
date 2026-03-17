import { ReturnExpenseDto } from 'src/modules/Expenses/domain/expenses/dto/returnExpense.dto';
import { ExpenseSources } from 'src/modules/Expenses/domain/expenses/expenseSources';

export function createListMessage(
  pages: ReturnExpenseDto[],
  currentPage: number,
): string {
  let message = '📝 *Your Expenses List:*\n\n';

  pages.forEach((exp, index) => {
    message += createListItem(exp, index);
  });

  return (message += `Curren page: ${currentPage + 1}\n\n`);
}

export function createListItem(exp: ReturnExpenseDto, index: number): string {
  let message = '';

  const date = new Date(exp.date).toLocaleDateString();
  const sourceEmoji = getSourceEmoji(exp.source);
  message += `*${index + 1}. ${exp.category}* ${sourceEmoji}\n`;
  message += `Amount: *${exp.amount} MDL*\n`;
  message += `Description: _${exp.description}_\n`;
  message += `Date: ${date}\n`;
  message += `\n\n`;

  return message;
}

function getSourceEmoji(source: ExpenseSources): string {
  switch (source) {
    case 'manual':
      return '✏️';
    case 'photo':
      return '🧾';
    default:
      return '';
  }
}
