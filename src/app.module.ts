import { Module } from '@nestjs/common';
import { BotModule } from './modules/Bot/bot.module';
import { DataBaseModule } from './modules/Database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [BotModule, DataBaseModule, ConfigModule.forRoot()],
})
export class AppModule {}
