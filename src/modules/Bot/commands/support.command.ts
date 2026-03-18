import { BotContext } from '../types/bot.context';

export async function supportCommand(ctx: BotContext) {
  await ctx.replyWithInvoice(
    'Support the developer ⭐',
    'Help keep this bot running and support future development!',
    'support_payload',
    'XTR', // XTR = Telegram Stars currency
    [
      { label: '⭐ Small tip', amount: 15 },
      { label: '🌟 Medium tip', amount: 50 },
      { label: '💫 Big tip', amount: 100 },
    ],
  );
}
