import { Conversation } from '@grammyjs/conversations';
import { BotContext } from '../../types/bot.context';
import { CreateExpenseDto } from 'src/modules/Expenses/domain/expenses/dto/createExpense.dto';
import { categoryEmojis } from 'src/modules/Expenses/domain/expenses/expenseCategory';

import { buildConfirmKeyboard } from '../keyboard/buildConfirm';

export async function processExpenseConfirmation(
  conversation: Conversation<BotContext>,
  ctx: BotContext,
  expense: CreateExpenseDto,
): Promise<boolean> {
  await ctx.reply(
    `✅ Please confirm your expense:\n\n` +
      `💰 Amount: *${expense.amount} MDL*\n` +
      `📂 Category: *${categoryEmojis[expense.category]} ${expense.category}*\n` +
      `📝 Description: *${expense.description || '—'}*\n` +
      `🏪 Merchant: *${expense.merchant || '—'}*\n` +
      `📅 Date: *${expense.date}*`,
    { parse_mode: 'Markdown', reply_markup: buildConfirmKeyboard() },
  );

  const update = await conversation.waitFor('callback_query:data');
  await update.answerCallbackQuery('');
  return update.callbackQuery.data === 'confirm:yes';
}
