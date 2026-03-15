import { Module } from '@nestjs/common';
import { BotModule } from './modules/Bot/bot.module';
import { DataBaseModule } from './modules/Database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ExpensesModule } from './modules/Expenses/expenses.module';

@Module({
  imports: [BotModule, ExpensesModule, DataBaseModule, ConfigModule.forRoot()],
})
export class AppModule {}
