import { InlineKeyboard } from 'grammy';
import { BotContext } from '../types/bot.context';
import { Conversation } from '@grammyjs/conversations';
import { sortExpenses } from '../helper/sortExpenses';
import { createListMessage } from '../helper/createListMessage';

export async function listConversation(
  conversation: Conversation<BotContext>,
  ctx: BotContext,
) {
  const pageSize = 5;
  let currentPage = 0;

  // Safely read and clear old message keyboard
  await conversation.external(async (ctx) => {
    if (ctx.session.lastListMessageId && ctx.chat) {
      await ctx.api
        .editMessageReplyMarkup(ctx.chat.id, ctx.session.lastListMessageId, {
          reply_markup: undefined,
        })
        .catch(() => {}); // silently ignore if message too old
    }
  });

  const expenses = await conversation.external((ctx) =>
    ctx.expensesService.getAll(ctx.me.id),
  );

  if (expenses.length === 0) {
    await ctx.reply('💸 You have no expenses entered yet.');
    return;
  }

  sortExpenses(expenses);

  const message = createListMessage(expenses.slice(0, pageSize), 0);
  const keyboard = buildPaginationKeyboard(0, pageSize, expenses.length);

  const sentMessage = await ctx.reply(message, {
    parse_mode: 'Markdown',
    reply_markup: keyboard,
  });

  // Safely write to session
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
              { reply_markup: undefined },
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
    } else {
      await update.answerCallbackQuery('');
      continue;
    }

    const start = currentPage * pageSize;
    const newMessage = createListMessage(
      expenses.slice(start, start + pageSize),
      currentPage,
    );
    const newKeyboard = buildPaginationKeyboard(
      currentPage,
      pageSize,
      expenses.length,
    );

    await ctx.api.editMessageText(
      sentMessage.chat.id,
      sentMessage.message_id,
      newMessage,
      { parse_mode: 'Markdown', reply_markup: newKeyboard },
    );

    await update.answerCallbackQuery('');
  }
}

function buildPaginationKeyboard(
  currentPage: number,
  pageSize: number,
  totalItems: number,
) {
  const totalPages = Math.ceil(totalItems / pageSize);
  const keyboard = new InlineKeyboard();

  if (currentPage > 0) {
    keyboard.text('⬅️ Prev', 'prev');
  } else {
    keyboard.text('⬅️ Prev');
  }

  if (currentPage < totalPages - 1) {
    keyboard.text('Next ➡️', 'next');
  } else {
    keyboard.text('Next ➡️');
  }

  return keyboard;
}

export async function listCommand(ctx: BotContext) {
  await ctx.conversation.enter('listConversation');
}
