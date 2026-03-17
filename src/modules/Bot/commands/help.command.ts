import { Context } from 'grammy';

export async function helpCommand(ctx: Context) {
  await ctx.reply('Currently write to the developer for help: @danu_114');
}
