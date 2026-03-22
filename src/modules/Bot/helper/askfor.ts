// askfor.ts
import { Conversation } from '@grammyjs/conversations';
import { InlineKeyboard } from 'grammy';
import { BotContext } from '../types/bot.context';
import { ExpenseCategory } from 'src/modules/Expenses/domain/expenses/expenseCategory';
import { buildCategoryKeyboard } from '../keyboards/categoryKeyboard';

export async function askForAmount(
  conversation: Conversation<BotContext>,
  ctx: BotContext,
): Promise<number> {
  while (true) {
    await ctx.reply('💵 Amount spent (MDL):', {
      reply_markup: buildCancelKeyboard(),
    });

    const update = await conversation.waitFor([
      'message:text',
      'callback_query:data',
    ]);

    if (
      update.callbackQuery &&
      'callbackQuery' in update &&
      update.callbackQuery.data === 'action:cancel'
    ) {
      await update.answerCallbackQuery('');
      await ctx.reply('❌ Cancelled.');
      await conversation.halt();
      return 0;
    }

    if ('message' in update && update.message?.text) {
      const amount = Number(update.message.text.trim());
      if (!isNaN(amount) && amount > 0) return amount;
      await ctx.reply('⚠️ Please enter a valid positive number.');
    }
  }
}

export async function askForText(
  conversation: Conversation<BotContext>,
  ctx: BotContext,
  question: string,
  skippable = false,
): Promise<string | undefined> {
  await ctx.reply(question, {
    reply_markup: skippable ? buildSkipCancelKeyboard() : buildCancelKeyboard(),
  });

  while (true) {
    const update = await conversation.waitFor([
      'message:text',
      'callback_query:data',
    ]);

    if (update.callbackQuery && 'callbackQuery' in update) {
      const data = update.callbackQuery.data;
      await update.answerCallbackQuery('');

      if (data === 'action:cancel') {
        await ctx.reply('❌ Cancelled.');
        await conversation.halt();
        return undefined;
      }

      if (data === 'action:skip') return undefined;
    }

    if ('message' in update && update.message?.text) {
      return update.message.text.trim();
    }
  }
}

export async function askForCategory(
  conversation: Conversation<BotContext>,
  ctx: BotContext,
): Promise<ExpenseCategory> {
  await ctx.reply('📂 Select a category:', {
    reply_markup: buildCategoryKeyboard(),
  });

  while (true) {
    const update = await conversation.waitFor('callback_query:data');
    const data = update.callbackQuery.data;
    await update.answerCallbackQuery('');

    if (data === 'action:cancel') {
      await ctx.reply('❌ Cancelled.');
      await conversation.halt();
    }

    if (data.startsWith('category:')) {
      return data.split(':')[1] as ExpenseCategory;
    }
  }
}

// shared keyboard builders
export function buildCancelKeyboard(): InlineKeyboard {
  return new InlineKeyboard().text('❌ Cancel', 'action:cancel');
}

export function buildSkipCancelKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('⏭️ Skip', 'action:skip')
    .text('❌ Cancel', 'action:cancel');
}
