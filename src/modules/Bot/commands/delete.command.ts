// import { Conversation } from '@grammyjs/conversations';
// import { BotContext } from '../types/bot.context';

// export async function deleteCommand(
//   conversation: Conversation<BotContext>,
//   ctx: BotContext,
// ) {
//   await ctx.reply('To cancel operation write cancel');

//   let index = 0;

//   while (true) {
//     await ctx.reply('Enter the index of the expense: ');
//     const update = await conversation.waitFor('message:text');

//     if (update.message.text.trim() === 'cancel') {
//       ctx.reply('Canceled.');
//       await conversation.halt();
//     }

//     index = Number(update.message.text);

//     if (isNaN(index) || index <= 0) {
//       ctx.reply('Please enter a valid value');
//       continue;
//     }

//     break;
//   }

//   try {
//   } catch (e) {
//     if (e instanceof Error) {
//       await ctx.reply(e.message);
//     } else {
//       await ctx.reply('Something went wrong');
//     }
//     console.error(e);
//   }
// }
