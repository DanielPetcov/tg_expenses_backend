import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { ExpensesModule } from '../Expenses/expenses.module';
import { AiModule } from '../Ai/ai.module';

@Module({
  imports: [ExpensesModule, AiModule],
  providers: [BotService],
})
export class BotModule {}
