import { Conversation } from '@grammyjs/conversations';

import { BotContext } from '../types/bot.context';

import { ExpenseCategory } from 'src/modules/Expenses/domain/expenses/expenseCategory';

import { buildCategoryKeyboard } from '../keyboards/categoryKeyboard';

export async function askForAmount(
  conversation: Conversation<BotContext>,
  ctx: BotContext,
): Promise<number> {
  while (true) {
    await ctx.reply('💵 Amount spent (MDL):');

    const update = await conversation.waitFor('message:text');

    if (update.message.text.trim().toLowerCase() === 'cancel') {
      await ctx.reply('❌ Cancelled.');
      await conversation.halt();
    }

    const amount = Number(update.message.text.trim());

    if (!isNaN(amount) && amount > 0) {
      return amount;
    }

    await ctx.reply('⚠️ Please enter a valid positive number.');
  }
}

export async function askForText(
  conversation: Conversation<BotContext>,
  ctx: BotContext,
  question: string,
): Promise<string | undefined> {
  await ctx.reply(question);

  const update = await conversation.waitFor('message:text');
  const text = update.message.text.trim();

  if (text.toLowerCase() === 'cancel') {
    await ctx.reply('❌ Cancelled.');
    await conversation.halt();
  }

  if (text === '-') return undefined;

  return text;
}

export async function askForCategory(
  conversation: Conversation<BotContext>,
  ctx: BotContext,
): Promise<ExpenseCategory> {
  await ctx.reply('📂 Select a category:', {
    reply_markup: buildCategoryKeyboard(),
  });

  while (true) {
    const update = await conversation.waitFor('callback_query:data', {
      otherwise: async (ctx) => {
        if (ctx.message?.text?.toLowerCase() === 'cancel') {
          await ctx.reply('❌ Cancelled.');
          await conversation.halt();
        }
      },
    });

    const data = update.callbackQuery.data;
    await update.answerCallbackQuery('');

    if (data.startsWith('category:')) {
      return data.split(':')[1] as ExpenseCategory;
    }
  }
}
