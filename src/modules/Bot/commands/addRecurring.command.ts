import { BotContext } from '../types/bot.context';

export async function addRecurringCommand(ctx: BotContext) {
  await ctx.conversation.enter('addRecurringConversation');
}
