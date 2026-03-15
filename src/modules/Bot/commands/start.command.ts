import { BotContext } from '../types/bot.context';

export async function startCommand(ctx: BotContext) {
  await ctx.reply('Welcom to the bot');

  const user = await ctx.expensesService.registerUser({
    telegramId: ctx.me.id,
    username: ctx.me.username,
  });

  if (user) {
    ctx.reply("Account succesfully created. Let's start your experience");
  } else {
    ctx.reply('Something went wrong. /start again');
  }
}
