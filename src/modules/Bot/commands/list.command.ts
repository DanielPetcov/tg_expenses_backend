import { BotContext } from '../types/bot.context';

export async function listCommand(ctx: BotContext) {
  await ctx.conversation.enter('listConversation');
}
