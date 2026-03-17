import { Conversation } from '@grammyjs/conversations';
import { BotContext } from '../types/bot.context';

export async function clearOldListKeyboard(
  conversation: Conversation<BotContext>,
) {
  await conversation.external(async (ctx) => {
    if (ctx.session.lastListMessageId && ctx.chat) {
      await ctx.api
        .editMessageReplyMarkup(ctx.chat.id, ctx.session.lastListMessageId, {
          reply_markup: undefined,
        })
        .catch(() => {});
    }
  });
}
