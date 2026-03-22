// categoryKeyboard.ts
import { InlineKeyboard } from 'grammy';
import {
  ExpenseCategories,
  categoryEmojis,
} from 'src/modules/Expenses/domain/expenses/expenseCategory';

export function buildCategoryKeyboard(): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  ExpenseCategories.forEach((cat, index) => {
    keyboard.text(`${categoryEmojis[cat]} ${cat}`, `category:${cat}`);
    if (index % 2 !== 0) keyboard.row();
  });

  // cancel on its own row at the bottom
  keyboard.row().text('❌ Cancel', 'action:cancel');

  return keyboard;
}
