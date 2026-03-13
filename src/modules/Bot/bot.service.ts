import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

import { Bot, Context } from 'grammy';
import {
  startCommand,
  addCommand,
  addConversation,
  helpCommand,
  commandsList,
} from './commands';
import {
  ConversationFlavor,
  conversations,
  createConversation,
} from '@grammyjs/conversations';

@Injectable()
export class BotService implements OnApplicationBootstrap {
  private readonly bot = new Bot<ConversationFlavor<Context>>(
    process.env.BOT_TOKEN!,
  );

  async onApplicationBootstrap() {
    this.bot.use(conversations());
    this.bot.use(createConversation(addConversation));

    await this.bot.command('start', startCommand);
    await this.bot.command('add', addCommand);
    await this.bot.command('help', helpCommand);

    await this.bot.api.setMyCommands(commandsList);
    await this.bot.start();
  }
}
