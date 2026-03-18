import { BotContext } from '../types/bot.context';

export async function addCommand(ctx: BotContext) {
  await ctx.conversation.enter('addConversation');
}
