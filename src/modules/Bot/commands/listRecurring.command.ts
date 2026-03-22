// commands/listRecurring.command.ts
import { BotContext } from '../types/bot.context';
import { ReturnRecurringExpenseDto } from 'src/modules/Expenses/domain/expenses/dto/returnRecurringExpenseDto';
import { categoryEmojis } from 'src/modules/Expenses/domain/expenses/expenseCategory';

export async function listRecurringCommand(ctx: BotContext) {
  if (!ctx.from) return;

  const items = await ctx.expensesService.getRecurring(ctx.from.id);

  if (items.length === 0) {
    await ctx.reply('🔁 You have no recurring expenses set up.');
    return;
  }

  const message = buildRecurringListMessage(items);
  await ctx.reply(message, { parse_mode: 'HTML' });
}

export function buildRecurringListMessage(
  items: ReturnRecurringExpenseDto[],
): string {
  let message = '🔁 <b>Your Recurring Expenses:</b>\n\n';

  items.forEach((item, index) => {
    const emoji = categoryEmojis[item.category] ?? '📦';
    const status = item.isActive ? '✅' : '⏸️';
    message += `${status} <b>${index + 1}. ${emoji} ${item.category}</b>\n`;
    message += `💰 Amount: <b>${item.amount} ${item.currency}</b>\n`;
    if (item.merchant) message += `🏪 Merchant: ${item.merchant}\n`;
    if (item.description) message += `📝 ${item.description}\n`;
    message += `📅 Repeats on day: <b>${item.dayOfMonth}</b>\n\n`;
  });

  return message;
}
