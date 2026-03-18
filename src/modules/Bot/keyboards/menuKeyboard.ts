import { Keyboard } from 'grammy';
import { BotContext } from '../types/bot.context';
import {
  addCommand,
  helpCommand,
  listCommand,
  summaryCommand,
} from '../commands';

export const keyboardLabels = [
  '➕ Add Expense',
  '📄 List Expenses',
  '📊 Summary',
  '❓ Help',
];

export const menuKeyboard = Keyboard.from([
  [Keyboard.text('➕ Add Expense'), Keyboard.text('📄 List Expenses')],
  [Keyboard.text('📊 Summary'), Keyboard.text('❓ Help')],
])
  .persistent()
  .resized();

export async function handleMenuKeyboardInputs(ctx: BotContext) {
  const text = ctx.msg?.text;
  if (!text) return;

  switch (text) {
    case '➕ Add Expense':
      await addCommand(ctx);
      break;
    case '📄 List Expenses':
      await listCommand(ctx);
      break;
    case '📊 Summary':
      await summaryCommand(ctx);
      break;
    case '❓ Help':
      await helpCommand(ctx);
      break;
  }
}
