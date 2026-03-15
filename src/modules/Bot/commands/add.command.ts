import { Conversation } from '@grammyjs/conversations';
import { CreateExpenseDto } from 'src/modules/Expenses/domain/dto/createExpense.dto';

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
      ctx.expensesService.create(expense),
    );

    if (createdExpense) {
      await ctx.reply('Successfully added the expense.');
    }
  } catch (e) {
    await ctx.reply('Something went wrong.');
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
  return update.message.text.trim();
}

async function askForAmount(
  conversation: Conversation<BotContext>,
  ctx: BotContext,
): Promise<number> {
  while (true) {
    await ctx.reply('Amount spent (MDL):');

    const update = await conversation.waitFor('message:text');
    const amount = Number(update.message.text);

    if (!isNaN(amount) && amount > 0) {
      return amount;
    }

    await ctx.reply('⚠️ Please enter a valid positive number.');
  }
}
