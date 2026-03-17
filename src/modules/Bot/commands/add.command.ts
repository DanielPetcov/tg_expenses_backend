import { Conversation } from '@grammyjs/conversations';
import { CreateExpenseDto } from 'src/modules/Expenses/domain/expenses/dto/createExpense.dto';

import { BotContext } from '../types/bot.context';

export async function addConversation(
  conversation: Conversation<BotContext>,
  ctx: BotContext,
) {
  const expense: CreateExpenseDto = {
    amount: 0,
    description: '',
    category: '',
    date: new Date().toISOString(),
    source: 'manual',
  };

  await ctx.reply('Enter the details, or write *cancel* to cancel.');

  expense.amount = await askForAmount(conversation, ctx);
  expense.description = await askForText(conversation, ctx, 'Description:');
  expense.category = await askForText(conversation, ctx, 'Category:');

  await ctx.reply('✅ Expense recorded. Please confirm:');

  await ctx.reply(
    `
    *Expense Details*

    Amount: *${expense.amount} MDL*
    Description: *${expense.description}*
    Category: *${expense.category}*
    Date: *${expense.date}*
    Source: *${expense.source}*
    `,
    { parse_mode: 'Markdown' },
  );

  try {
    const createdExpense = await conversation.external((ctx) =>
      ctx.expensesService.create(expense, ctx.from!.id),
    );

    if (createdExpense) {
      await ctx.reply('Successfully added the expense.');
    }
  } catch (e) {
    if (e instanceof Error) {
      await ctx.reply(e.message);
    } else {
      await ctx.reply('Something went wrong.');
    }
    console.error(e);
  }
}

export async function addCommand(ctx: BotContext) {
  await ctx.conversation.enter('addConversation');
}

async function askForText(
  conversation: Conversation<BotContext>,
  ctx: BotContext,
  question: string,
): Promise<string> {
  await ctx.reply(question);

  const update = await conversation.waitFor('message:text');

  if (update.message.text.trim() === 'cancel') {
    ctx.reply('Canceled.');
    await conversation.halt();
  }

  return update.message.text.trim();
}

async function askForAmount(
  conversation: Conversation<BotContext>,
  ctx: BotContext,
): Promise<number> {
  while (true) {
    await ctx.reply('Amount spent (MDL):');

    const update = await conversation.waitFor('message:text');

    if (update.message.text.trim() === 'cancel') {
      ctx.reply('Canceled.');
      await conversation.halt();
    }

    const amount = Number(update.message.text);

    if (!isNaN(amount) && amount > 0) {
      return amount;
    }

    await ctx.reply('⚠️ Please enter a valid positive number.');
  }
}
