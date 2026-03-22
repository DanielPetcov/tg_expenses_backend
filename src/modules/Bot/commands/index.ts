import { BotCommand } from 'grammy/types';

export const commandsList: readonly BotCommand[] = [
  { command: 'start', description: 'Start the bot' },
  { command: 'add', description: 'Add an expense' },
  {
    command: 'add_recurring',
    description:
      'Add a recurring expense, that will repeat every month on the chosen date',
  },
  { command: 'list', description: 'List all expenses, or a part' },
  {
    command: 'list_recurring',
    description: 'List all recurring expenses, or a part',
  },
  { command: 'recurring', description: 'Actions for recurring expenses' },
  {
    command: 'summary',
    description: 'Overall summary about your expenses',
  },
  { command: 'help', description: 'Get help' },
];

export * from './start.command';
export * from './add.command';
export * from './list.command';
export * from './summary.command';
export * from './help.command';

export * from './addRecurring.command';
export * from './listRecurring.command';
export * from './recurring.command';
