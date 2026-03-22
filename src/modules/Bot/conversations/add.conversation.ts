import { Conversation } from '@grammyjs/conversations';

import { BotContext } from '../types/bot.context';
import { CreateExpenseDto } from 'src/modules/Expenses/domain/expenses/dto/createExpense.dto';

import { buildExpenseFromReceipt } from '../helper/expenses/buildExpenseFromReceipt';
import { processExpenseConfirmation } from '../helper/expenses/processExpenseConfirmation';
import { saveExpense } from '../helper/expenses/saveExpense';

import { askForAmount, askForCategory, askForText } from '../helper/askfor';

export async function addConversation(
  conversation: Conversation<BotContext>,
  ctx: BotContext,
) {
  const pendings = await conversation.external(
    (ctx) => ctx.session.pendingReceipt,
  );

  if (pendings?.length) {
    for (const pending of pendings) {
      // for...of instead of forEach
      const expense = await buildExpenseFromReceipt(conversation, ctx, pending);
      const confirmed = await processExpenseConfirmation(
        conversation,
        ctx,
        expense,
      );

      if (!confirmed) {
        await ctx.reply('❌ Expense cancelled.');
        continue; // skip this one, move to next receipt
      }

      await saveExpense(conversation, ctx, expense);
    }

    await conversation.external((ctx) => {
      ctx.session.pendingReceipt = undefined;
    });

    return;
  }

  // manual flow
  await ctx.reply('Enter the details, or cancel.', {
    parse_mode: 'Markdown',
  });

  const expense: CreateExpenseDto = {
    amount: await askForAmount(conversation, ctx),
    description: await askForText(conversation, ctx, '📝 Description:', true),
    category: await askForCategory(conversation, ctx),
    date: new Date().toISOString().split('T')[0],
    source: 'manual',
  };

  const confirmed = await processExpenseConfirmation(
    conversation,
    ctx,
    expense,
  );

  if (!confirmed) {
    await ctx.reply('❌ Expense cancelled.');
    return;
  }

  await saveExpense(conversation, ctx, expense);
}
