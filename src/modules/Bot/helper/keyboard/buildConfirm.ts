import { InlineKeyboard } from 'grammy';

export function buildConfirmKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('✅ Confirm', 'confirm:yes')
    .text('❌ Cancel', 'confirm:no');
}
