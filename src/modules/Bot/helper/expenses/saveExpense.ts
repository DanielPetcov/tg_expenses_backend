import { Conversation } from '@grammyjs/conversations';
import { BotContext } from '../../types/bot.context';
import { CreateExpenseDto } from 'src/modules/Expenses/domain/expenses/dto/createExpense.dto';

export async function saveExpense(
  conversation: Conversation<BotContext>,
  ctx: BotContext,
  expense: CreateExpenseDto,
): Promise<void> {
  try {
    const created = await conversation.external((ctx) =>
      ctx.expensesService.create(expense, ctx.from!.id),
    );
    if (created) await ctx.reply('✅ Expense successfully added!');
  } catch (e) {
    await ctx.reply(e instanceof Error ? e.message : 'Something went wrong.');
    console.error(e);
  }
}
