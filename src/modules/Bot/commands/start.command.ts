import { Context } from 'grammy';

export async function startCommand(ctx: Context) {
  await ctx.reply('Welcom to the bot');
}
