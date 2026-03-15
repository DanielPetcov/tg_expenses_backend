import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

import { Bot } from 'grammy';
import {
  startCommand,
  addCommand,
  addConversation,
  helpCommand,
  commandsList,
} from './commands';
import { conversations, createConversation } from '@grammyjs/conversations';
import { ExpensesService } from '../Expenses/expenses.service';

import { BotContext } from './types/bot.context';

@Injectable()
export class BotService implements OnApplicationBootstrap {
  constructor(private readonly expensesService: ExpensesService) {}

  private readonly bot = new Bot<BotContext>(process.env.BOT_TOKEN!);

  async onApplicationBootstrap() {
    this.bot.use((ctx, next) => {
      ctx.expensesService = this.expensesService;
      return next();
    });

    this.bot.use(conversations());
    this.bot.use(createConversation(addConversation));

    this.bot.command('start', startCommand);
    this.bot.command('add', addCommand);
    this.bot.command('help', helpCommand);

    await this.bot.api.setMyCommands(commandsList);
    await this.bot.start();
  }
}
