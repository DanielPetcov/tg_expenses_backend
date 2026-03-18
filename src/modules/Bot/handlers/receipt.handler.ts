import { BotContext } from '../types/bot.context';
import { InlineKeyboard } from 'grammy';

export async function receiptHandler(ctx: BotContext) {
  const processing = await ctx.reply('🧾 Analyzing your receipt...');

  try {
    const file = await ctx.getFile();
    const imagePath = await file.download();

    const result = await ctx.aiService.analyzeReceipt(imagePath);

    await ctx.api.deleteMessage(ctx.chat!.id, processing.message_id);

    // store in session
    if (ctx.session.pendingReceipt) {
      ctx.session.pendingReceipt.push(result);
    } else {
      ctx.session.pendingReceipt = [result];
    }

    await ctx.reply(
      `✅ Receipt analyzed!\n\n` +
        `🏪 Merchant: ${result.merchant}\n` +
        `💰 Total: ${result.total} MDL\n` +
        `📂 Category: ${result.category}\n` +
        `📅 Date: ${result.date}\n\n` +
        `Want to log this expense?`,
      {
        reply_markup: new InlineKeyboard()
          .text('✅ Log it', 'receipt:confirm')
          .text('❌ Discard', 'receipt:discard'),
      },
    );
  } catch (e) {
    await ctx.reply('❌ Could not analyze the receipt. Try a clearer photo.');
    console.error(e);
  }
}
