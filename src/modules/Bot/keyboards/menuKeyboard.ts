import { Keyboard } from 'grammy';
import { BotContext } from '../types/bot.context';
import { addCommand, helpCommand, listCommand } from '../commands';

export const keyboardLabels = ['➕ Add Expense', '📄 List Expenses', '❓ Help'];

export const menuKeyboard = Keyboard.from(
  keyboardLabels.map((l) => [Keyboard.text(l)]),
)
  .persistent()
  .resized();

export async function handleMenuKeyboardInputs(ctx: BotContext) {
  const text = ctx.msg?.text;
  console.log(text);

  if (!text) return;

  switch (text) {
    case '➕ Add Expense':
      await addCommand(ctx);
      break;
    case '📄 List Expenses':
      await listCommand(ctx);
      break;
    case '❓ Help':
      await helpCommand(ctx);
      break;
  }
}
