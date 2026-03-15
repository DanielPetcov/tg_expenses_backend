import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { ExpensesModule } from '../Expenses/expenses.module';

@Module({
  imports: [ExpensesModule],
  providers: [BotService],
})
export class BotModule {}
