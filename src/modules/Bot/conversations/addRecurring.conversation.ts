import { Conversation } from '@grammyjs/conversations';
import { InlineKeyboard } from 'grammy';
import { BotContext } from '../types/bot.context';
import { CreateRecurringExpenseDto } from 'src/modules/Expenses/domain/expenses/dto/createRecurringExpenseDto';
import { askForAmount, askForCategory, askForText } from '../helper/askfor';
import { categoryEmojis } from 'src/modules/Expenses/domain/expenses/expenseCategory';

export async function addRecurringConversation(
  conversation: Conversation<BotContext>,
  ctx: BotContext,
) {
  await ctx.reply(
    '🔁 <b>Add Recurring Expense</b>\n\nThis expense will be automatically logged every month.',
    { parse_mode: 'HTML' },
  );

  const amount = await askForAmount(conversation, ctx);
  const merchant = await askForText(conversation, ctx, 'Merchant: ');
  const description = await askForText(
    conversation,
    ctx,
    '📝 Description:',
    true,
  );
  const category = await askForCategory(conversation, ctx);
  const dayOfMonth = await askForDayOfMonth(conversation, ctx);

  const dto: CreateRecurringExpenseDto = {
    amount,
    merchant,
    description,
    category,
    dayOfMonth,
    currency: 'MDL',
  };

  // confirm
  await ctx.reply(
    `✅ <b>Please confirm:</b>\n\n` +
      `💰 Amount: <b>${dto.amount} MDL</b>\n` +
      `📂 Category: <b>${categoryEmojis[dto.category]} ${dto.category}</b>\n` +
      `Merchant: <b>${dto.merchant}</b>\n ` +
      `📝 Description: <b>${dto.description || '—'}</b>\n` +
      `📅 Repeats on: <b>day ${dto.dayOfMonth} of every month</b>`,
    {
      parse_mode: 'HTML',
      reply_markup: new InlineKeyboard()
        .text('✅ Confirm', 'confirm:yes')
        .text('❌ Cancel', 'confirm:no'),
    },
  );

  const confirmUpdate = await conversation.waitFor('callback_query:data');
  await confirmUpdate.answerCallbackQuery('');

  if (confirmUpdate.callbackQuery.data === 'confirm:no') {
    await ctx.reply('❌ Cancelled.');
    return;
  }

  await conversation.external((ctx) =>
    ctx.expensesService.createRecurring(dto, ctx.from!.id),
  );

  await ctx.reply(
    `✅ Recurring expense saved! It will be logged automatically on day <b>${dto.dayOfMonth}</b> of each month.`,
    { parse_mode: 'HTML' },
  );
}

async function askForDayOfMonth(
  conversation: Conversation<BotContext>,
  ctx: BotContext,
): Promise<number> {
  while (true) {
    await ctx.reply('📅 On which day of the month should this repeat? (1–28)');

    const update = await conversation.waitFor('message:text');
    const text = update.message.text.trim();

    if (text.toLowerCase() === 'cancel') {
      await ctx.reply('❌ Cancelled.');
      await conversation.halt();
    }

    const day = parseInt(text);
    if (!isNaN(day) && day >= 1 && day <= 28) {
      return day;
    }

    await ctx.reply('⚠️ Please enter a number between 1 and 28.');
  }
}
