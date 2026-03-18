import { BotContext } from '../types/bot.context';
import {
  MonthlySummary,
  CategoryBreakdown,
} from 'src/modules/Expenses/domain/summary/summary.model';
import { categoryEmojis } from 'src/modules/Expenses/domain/expenses/expenseCategory';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export async function summaryCommand(ctx: BotContext) {
  if (!ctx.from) return;

  const processing = await ctx.reply('📊 Calculating your summary...');

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const summary = await ctx.expensesService.summary(
    ctx.from.id,
    currentYear,
    currentMonth,
  );

  await ctx.api.deleteMessage(ctx.chat!.id, processing.message_id);

  if (!summary) {
    await ctx.reply('💸 No expenses found for this month.');
    return;
  }

  await ctx.reply(buildSummaryMessage(summary), { parse_mode: 'HTML' });
}

function buildSummaryMessage(summary: MonthlySummary): string {
  const monthName = monthNames[summary.month - 1];

  let message = `📊 <b>Summary — ${monthName} ${summary.year}</b>\n\n`;

  message += `💰 Total spent: <b>${summary.totalAmount.toFixed(2)} MDL</b>\n`;
  message += `📅 Daily average: <b>${summary.dailyAverage.toFixed(2)} MDL</b>\n`;
  message += `🧾 Transactions: <b>${summary.transactionCount}</b>\n`;

  if (summary.recurringTotal > 0) {
    message += `🔁 Recurring: <b>${summary.recurringTotal.toFixed(2)} MDL</b>\n`;
  }

  message += `\n📂 <b>By category:</b>\n`;
  message += buildCategoryBreakdown(
    summary.categoryBreakdown,
    summary.totalAmount,
  );

  if (summary.topMerchants.length > 0) {
    message += `\n🏪 <b>Top merchants:</b>\n`;
    summary.topMerchants.forEach((merchant, index) => {
      message += `  ${index + 1}. ${escapeHtml(merchant.name)} — <b>${merchant.total.toFixed(2)} MDL</b>\n`;
    });
  }

  message += `\n💸 <b>Biggest expense:</b> ${summary.largestExpense.amount.toFixed(2)} MDL`;
  message += ` (${categoryEmojis[summary.largestExpense.category] ?? '📦'} ${summary.largestExpense.category}`;
  if (summary.largestExpense.merchant) {
    message += `, ${escapeHtml(summary.largestExpense.merchant)}`;
  }
  message += `, ${summary.largestExpense.date})\n`;

  return message;
}

function buildCategoryBreakdown(
  breakdown: CategoryBreakdown,
  total: number,
): string {
  return (
    Object.entries(breakdown)
      .sort(([, a], [, b]) => b - a)
      .map(([category, amount]) => {
        const emoji = categoryEmojis[category] ?? '📦';
        const percent = ((amount / total) * 100).toFixed(0);
        const padded = amount.toFixed(2).padStart(10);
        return `  ${emoji} ${category.padEnd(14)} ${padded} MDL  (${percent}%)`;
      })
      .join('\n') + '\n'
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
