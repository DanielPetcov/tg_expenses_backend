import { BotContext } from '../types/bot.context';
import { Conversation } from '@grammyjs/conversations';
import { sortExpenses } from '../helper/sortExpenses';
import { ReturnExpenseDto } from 'src/modules/Expenses/domain/expenses/dto/returnExpense.dto';
import { buildListPage } from '../helper/buildListPage';
import { clearOldListKeyboard } from '../helper/clearOldListKeyboard';

export async function listConversation(
  conversation: Conversation<BotContext>,
  ctx: BotContext,
) {
  const pageSize = 5;
  let currentPage = 0;

  await clearOldListKeyboard(conversation);

  const expenses = await conversation.external((ctx) =>
    ctx.expensesService.getAll(ctx.from!.id),
  );

  if (expenses.length === 0) {
    await ctx.reply('💸 You have no expenses entered yet.');
    return;
  }

  sortExpenses(expenses);

  const { message, keyboard } = buildListPage(expenses, currentPage, pageSize);
  const sentMessage = await ctx.reply(message, {
    parse_mode: 'HTML',
    reply_markup: keyboard,
  });

  await conversation.external((ctx) => {
    ctx.session.lastListMessageId = sentMessage.message_id;
  });

  while (true) {
    const update = await conversation.waitFor('callback_query:data', {
      otherwise: async (ctx: BotContext) => {
        if (ctx.callbackQuery) {
          await ctx.answerCallbackQuery('');
        } else if (ctx.message?.text) {
          await ctx.api
            .editMessageReplyMarkup(
              sentMessage.chat.id,
              sentMessage.message_id,
              {
                reply_markup: undefined,
              },
            )
            .catch(() => {});
          await conversation.halt({ next: true });
        }
      },
    });

    const data = update.callbackQuery.data;

    if (data === 'next') {
      if ((currentPage + 1) * pageSize < expenses.length) currentPage++;
    } else if (data === 'prev') {
      if (currentPage > 0) currentPage--;
    } else if (data.startsWith('delete:')) {
      await handleDeletion(conversation, data, expenses, ctx);
      const maxPage = Math.max(0, Math.ceil(expenses.length / pageSize) - 1);
      if (currentPage > maxPage) currentPage = maxPage;
    } else {
      await update.answerCallbackQuery('');
      continue;
    }

    const { message: newMessage, keyboard: newKeyboard } = buildListPage(
      expenses,
      currentPage,
      pageSize,
    );

    await ctx.api.editMessageText(
      sentMessage.chat.id,
      sentMessage.message_id,
      newMessage,
      { parse_mode: 'HTML', reply_markup: newKeyboard },
    );

    await update.answerCallbackQuery('');
  }
}

async function handleDeletion(
  conversation: Conversation<BotContext>,
  data: string,
  expenses: ReturnExpenseDto[],
  ctx: BotContext,
) {
  const id = data.split(':')[1];

  await conversation.external((ctx) =>
    ctx.expensesService.delete(id, ctx.from!.id),
  );

  const updated = await conversation.external((ctx) =>
    ctx.expensesService.getAll(ctx.from!.id),
  );

  sortExpenses(updated);
  expenses.length = 0;
  expenses.push(...updated);
}

export async function listCommand(ctx: BotContext) {
  await ctx.conversation.enter('listConversation');
}
