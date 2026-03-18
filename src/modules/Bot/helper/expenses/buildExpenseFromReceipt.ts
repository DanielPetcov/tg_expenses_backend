import { BotContext } from '../../types/bot.context';
import { ReceiptResponse } from 'src/modules/Ai/models/receipt-response.model';
import { CreateExpenseDto } from 'src/modules/Expenses/domain/expenses/dto/createExpense.dto';
import { Conversation } from '@grammyjs/conversations';
import { InlineKeyboard } from 'grammy';

import { askForAmount, askForCategory, askForText } from '../askfor';

export async function buildExpenseFromReceipt(
  conversation: Conversation<BotContext>,
  ctx: BotContext,
  pending: ReceiptResponse,
): Promise<CreateExpenseDto> {
  const expense: CreateExpenseDto = {
    amount: pending.total,
    merchant: pending.merchant,
    category: pending.category,
    date: pending.date,
    source: 'photo',
  };

  await ctx.reply(
    `📋 Pre-filled from receipt:\n\n` +
      `💰 Amount: *${expense.amount} MDL*\n` +
      `🏪 Merchant: *${expense.merchant}*\n` +
      `📂 Category: *${expense.category}*\n` +
      `📅 Date: *${expense.date}*`,
    {
      parse_mode: 'Markdown',
      reply_markup: new InlineKeyboard()
        .text('✅ Looks good', 'prefill:confirm')
        .text('✏️ Edit', 'prefill:edit'),
    },
  );

  const update = await conversation.waitFor('callback_query:data');
  await update.answerCallbackQuery('');

  if (update.callbackQuery.data === 'prefill:edit') {
    expense.amount = await askForAmount(conversation, ctx);
    expense.description = await askForText(
      conversation,
      ctx,
      '📝 Description (optional, - to skip):',
    );
    expense.category = await askForCategory(conversation, ctx);
  }

  return expense;
}
