import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

import { Bot, session } from 'grammy';
import {
  startCommand,
  addCommand,
  addConversation,
  helpCommand,
  commandsList,
  listCommand,
  listConversation,
} from './commands';
import { conversations, createConversation } from '@grammyjs/conversations';
import { ExpensesService } from '../Expenses/expenses.service';

import { BotContext } from './types/bot.context';

import { initial } from './session/session-shape';
import {
  handleMenuKeyboardInputs,
  keyboardLabels,
} from './keyboards/menuKeyboard';

@Injectable()
export class BotService implements OnApplicationBootstrap {
  constructor(private readonly expensesService: ExpensesService) {}

  private readonly bot = new Bot<BotContext>(process.env.BOT_TOKEN!);

  async onApplicationBootstrap() {
    this.bot.catch((err) => {
      console.error('Bot error: ', err.message);
    });

    this.bot.use((ctx, next) => {
      ctx.expensesService = this.expensesService;
      return next();
    });

    this.bot.use(session({ initial }));
    this.bot.use(conversations());
    this.bot.use(createConversation(addConversation));
    this.bot.use(createConversation(listConversation));

    this.bot.command('start', startCommand);
    this.bot.command('add', addCommand);
    this.bot.command('list', listCommand);
    this.bot.command('help', helpCommand);

    await this.bot.api.setMyCommands(commandsList);

    this.bot.on('message:text', async (ctx, next) => {
      if (keyboardLabels.includes(ctx.msg.text)) {
        await ctx.conversation.exitAll();
      }
      await next();
    });

    this.bot.on('message:text', handleMenuKeyboardInputs);

    await this.bot.start();
  }
}
