import { BotCommand } from 'grammy/types';

export const commandsList: readonly BotCommand[] = [
  { command: 'start', description: 'Start the bot' },
  { command: 'add', description: 'Add an expense' },
  { command: 'list', description: 'List all expenses, or a part' },
  { command: 'delete', description: 'Delete an expense' },
  {
    command: 'summary',
    description: 'Overall summary about your expenses',
  },
  { command: 'help', description: 'Get help' },
];

export * from './start.command';
export * from './add.command';
export * from './list.command';
export * from './delete.command';
export * from './summary.command';
export * from './help.command';
