import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

import { Bot, session } from 'grammy';
import { hydrateFiles } from '@grammyjs/files';
import {
  startCommand,
  addCommand,
  helpCommand,
  commandsList,
  listCommand,
  summaryCommand,
} from './commands';
import { conversations, createConversation } from '@grammyjs/conversations';
import { ExpensesService } from '../Expenses/expenses.service';

import { BotContext } from './types/bot.context';

import { initial } from './session/session-shape';
import {
  handleMenuKeyboardInputs,
  keyboardLabels,
} from './keyboards/menuKeyboard';

import { receiptHandler } from './handlers';
import { AiService } from '../Ai/ai.service';
import { addConversation } from './conversations/add.conversation';
import { listConversation } from './conversations/list.conversation';

@Injectable()
export class BotService implements OnApplicationBootstrap {
  constructor(
    private readonly expensesService: ExpensesService,
    private readonly aiService: AiService,
  ) {}

  private readonly bot = new Bot<BotContext>(process.env.BOT_TOKEN!);

  async onApplicationBootstrap() {
    this.bot.catch((err) => {
      console.error('Bot error: ', err.message);
    });

    this.bot.api.config.use(hydrateFiles(this.bot.token));

    this.bot.use((ctx, next) => {
      ctx.expensesService = this.expensesService;
      ctx.aiService = this.aiService;
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
    this.bot.command('summary', summaryCommand);

    await this.bot.api.setMyCommands(commandsList);

    this.bot.on('message:text', async (ctx, next) => {
      if (keyboardLabels.includes(ctx.msg.text)) {
        await ctx.conversation.exitAll();
      }
      await next();
    });

    this.bot.on('message:text', handleMenuKeyboardInputs);

    this.bot.on('message:photo', receiptHandler);

    this.bot.callbackQuery('receipt:discard', async (ctx) => {
      ctx.session.pendingReceipt = undefined;
      await ctx.editMessageReplyMarkup({ reply_markup: undefined });
      await ctx.answerCallbackQuery('🗑️ Discarded');
    });

    this.bot.callbackQuery('receipt:confirm', async (ctx) => {
      await ctx.answerCallbackQuery('');
      await ctx.editMessageReplyMarkup({ reply_markup: undefined });
      await ctx.conversation.enter('addConversation');
    });

    this.bot.on('pre_checkout_query', (ctx) =>
      ctx.answerPreCheckoutQuery(true),
    );

    this.bot.on('message:successful_payment', async (ctx) => {
      const stars = ctx.message.successful_payment.total_amount;
      await ctx.reply(
        `🙏 Thank you so much for your ${stars} stars! It means a lot.`,
      );
    });

    await this.bot.start();
  }
}
