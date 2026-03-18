import { Context, SessionFlavor } from 'grammy';
import { ConversationFlavor } from '@grammyjs/conversations';
import { FileFlavor } from '@grammyjs/files';
import { SessionData } from '../session/session-shape';

import { ExpensesService } from 'src/modules/Expenses/expenses.service';
import { AiService } from 'src/modules/Ai/ai.service';

type BaseContext = Context &
  ConversationFlavor<Context> &
  SessionFlavor<SessionData> & {
    expensesService: ExpensesService;
    aiService: AiService;
  };

export type BotContext = FileFlavor<BaseContext>;
