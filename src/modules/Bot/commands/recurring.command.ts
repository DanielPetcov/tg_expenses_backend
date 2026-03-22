// commands/recurring.command.ts
import { BotContext } from '../types/bot.context';
import { InlineKeyboard } from 'grammy';

export async function recurringMenuCommand(ctx: BotContext) {
  await ctx.reply(
    '🔁 <b>Recurring Expenses</b>\n\nWhat would you like to do?',
    {
      parse_mode: 'HTML',
      reply_markup: new InlineKeyboard()
        .text('➕ Add Recurring', 'recurring:add')
        .row()
        .text('📄 List Recurring', 'recurring:list')
        .row()
        .text('⏸️ Toggle / 🗑️ Delete', 'recurring:manage')
        .text('❌ Cancel', 'recurring:cancel'),
    },
  );
}
