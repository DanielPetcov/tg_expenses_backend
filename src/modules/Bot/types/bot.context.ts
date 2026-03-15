import { Context } from 'grammy';
import { ConversationFlavor } from '@grammyjs/conversations';

import { ExpensesService } from 'src/modules/Expenses/expenses.service';

export type BotContext = Context &
  ConversationFlavor<Context> & {
    expensesService: ExpensesService;
  };
