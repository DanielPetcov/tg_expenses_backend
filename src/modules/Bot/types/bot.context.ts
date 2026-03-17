import { Context, SessionFlavor } from 'grammy';
import { ConversationFlavor } from '@grammyjs/conversations';

import { ExpensesService } from 'src/modules/Expenses/expenses.service';
import { SessionData } from '../session/session-shape';

export type BotContext = Context &
  ConversationFlavor<Context> &
  SessionFlavor<SessionData> & {
    expensesService: ExpensesService;
  };
