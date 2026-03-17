import { BotContext } from '../types/bot.context';

import { menuKeyboard } from '../keyboards/menuKeyboard';

export async function startCommand(ctx: BotContext) {
  await ctx.reply('Welcom to the bot');

  const userExists = await ctx.expensesService.userExists(ctx.me.id);
  if (userExists) {
    ctx.reply('Account exists', {
      reply_markup: menuKeyboard,
    });
    return;
  }

  const user = await ctx.expensesService.registerUser({
    telegramId: ctx.me.id,
    username: ctx.me.username,
  });

  if (user) {
    ctx.reply("Account succesfully created. Let's start your experience", {
      reply_markup: menuKeyboard,
    });
  } else {
    ctx.reply('Something went wrong. /start again');
  }
}
