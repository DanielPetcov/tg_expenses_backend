import { BotContext } from '../types/bot.context';

export async function helpCommand(ctx: BotContext) {
  await ctx.reply('Currently write to the developer for help: @danu_114');
}
