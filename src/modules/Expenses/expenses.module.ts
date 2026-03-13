import { Module } from '@nestjs/common';
import { DataBaseModule } from '../Database/database.module';
import { IExpensesRepository } from './expenses.repository.interface';
import { ExpensesRepository } from './expenses.repository';

@Module({
  imports: [DataBaseModule],
  providers: [
    {
      provide: IExpensesRepository,
      useClass: ExpensesRepository,
    },
  ],
})
export class ExpensesModule {}
