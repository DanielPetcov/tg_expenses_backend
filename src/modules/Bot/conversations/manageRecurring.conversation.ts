// commands/manageRecurring.conversation.ts
import { Conversation } from '@grammyjs/conversations';
import { InlineKeyboard } from 'grammy';
import { BotContext } from '../types/bot.context';
import { ReturnRecurringExpenseDto } from 'src/modules/Expenses/domain/expenses/dto/returnRecurringExpenseDto';
import { categoryEmojis } from 'src/modules/Expenses/domain/expenses/expenseCategory';

export async function manageRecurringConversation(
  conversation: Conversation<BotContext>,
  ctx: BotContext,
) {
  const items = await conversation.external((ctx) =>
    ctx.expensesService.getRecurring(ctx.from!.id),
  );

  if (items.length === 0) {
    await ctx.reply('🔁 You have no recurring expenses to manage.');
    return;
  }

  // show list with per-item action buttons
  await ctx.reply('🔁 <b>Manage Recurring Expenses</b>\n\nSelect an action:', {
    parse_mode: 'HTML',
    reply_markup: buildManageKeyboard(items),
  });

  while (true) {
    const update = await conversation.waitFor('callback_query:data', {
      otherwise: async (ctx) => {
        if (ctx.message?.text) await conversation.halt();
      },
    });

    const data = update.callbackQuery.data;
    await update.answerCallbackQuery('');

    if (data === 'action:cancel') {
      await ctx.reply('👋 Done managing recurring expenses.');
      await conversation.halt();
      return;
    }

    if (data.startsWith('recurring_toggle:')) {
      const id = data.split(':')[1];
      await conversation.external((ctx) =>
        ctx.expensesService.toggleRecurring(id, ctx.from!.id),
      );

      // refresh list
      const updated = await conversation.external((ctx) =>
        ctx.expensesService.getRecurring(ctx.from!.id),
      );

      await ctx.editMessageReplyMarkup({
        reply_markup: buildManageKeyboard(updated),
      });
    }

    if (data.startsWith('recurring_delete:')) {
      const id = data.split(':')[1];

      // confirm before deleting
      await ctx.reply(
        '⚠️ Are you sure you want to delete this recurring expense?',
        {
          reply_markup: new InlineKeyboard()
            .text('✅ Yes, delete', `recurring_delete_confirm:${id}`)
            .text('❌ No', 'action:cancel'),
        },
      );
    }

    if (data.startsWith('recurring_delete_confirm:')) {
      const id = data.split(':')[1];
      await conversation.external((ctx) =>
        ctx.expensesService.deleteRecurring(id, ctx.from!.id),
      );

      const updated = await conversation.external((ctx) =>
        ctx.expensesService.getRecurring(ctx.from!.id),
      );

      if (updated.length === 0) {
        await ctx.reply('✅ Deleted. No more recurring expenses.');
        await conversation.halt();
        return;
      }

      await ctx.reply('✅ Deleted.', {
        reply_markup: buildManageKeyboard(updated),
      });
    }
  }
}

function buildManageKeyboard(
  items: ReturnRecurringExpenseDto[],
): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  items.forEach((item, index) => {
    const status = item.isActive ? '⏸️ Pause' : '▶️ Resume';
    const emoji = categoryEmojis[item.category] ?? '📦';
    keyboard
      .text(`${emoji} #${index + 1} — ${item.amount} MDL`, 'noop')
      .row()
      .text(status, `recurring_toggle:${item.id}`)
      .text('🗑️ Delete', `recurring_delete:${item.id}`)
      .row();
  });

  keyboard.text('❌ Close', 'action:cancel');
  return keyboard;
}
