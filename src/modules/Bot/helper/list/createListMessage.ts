import { ReturnExpenseDto } from 'src/modules/Expenses/domain/expenses/dto/returnExpense.dto';
import { ExpenseSources } from 'src/modules/Expenses/domain/expenses/expenseSources';
import { categoryEmojis } from 'src/modules/Expenses/domain/expenses/expenseCategory';

export function createListMessage(
  pages: ReturnExpenseDto[],
  currentPage: number,
): string {
  let message = '📝 <b>Your Expenses List:</b>\n\n';

  pages.forEach((exp, index) => {
    message += createListItem(exp, index);
  });

  message += `Page: ${currentPage + 1}`;

  return message;
}

export function createListItem(exp: ReturnExpenseDto, index: number): string {
  const date = new Date(exp.date).toLocaleDateString();
  const sourceEmoji = getSourceEmoji(exp.source);
  const categoryEmoji = categoryEmojis[exp.category] ?? '📦';

  let message = `<b>${index + 1}. ${categoryEmoji} ${exp.category}</b> ${sourceEmoji}\n`;
  message += `💰 Amount: <b>${exp.amount} ${exp.currency}</b>\n`;

  if (exp.merchant) {
    message += `🏪 Merchant: ${escapeHtml(exp.merchant)}\n`;
  }

  if (exp.description) {
    message += `📝 Description: <i>${escapeHtml(exp.description)}</i>\n`;
  }

  message += `📅 Date: ${date}\n`;
  message += '\n';

  return message;
}

function getSourceEmoji(source: ExpenseSources): string {
  switch (source) {
    case 'manual':
      return '';
    case 'photo':
      return '🧾';
    default:
      return '';
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
