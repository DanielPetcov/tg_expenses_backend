import { InlineKeyboard } from 'grammy';
import { BotContext } from '../types/bot.context';

export async function supportCommand(ctx: BotContext) {
  await ctx.reply(
    '⭐ <b>Support the Developer</b>\n\nChoose a tier to support with Telegram Stars:',
    {
      parse_mode: 'HTML',
      reply_markup: new InlineKeyboard()
        .text('⭐ 15 Stars', 'support:15')
        .row()
        .text('🌟 50 Stars', 'support:50')
        .row()
        .text('💫 100 Stars', 'support:100'),
    },
  );
}
