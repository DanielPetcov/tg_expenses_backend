import { Module } from '@nestjs/common';
import { BotModule } from './modules/Bot/bot.module';
import { DataBaseModule } from './modules/Database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ExpensesModule } from './modules/Expenses/expenses.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    BotModule,
    ExpensesModule,
    DataBaseModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
