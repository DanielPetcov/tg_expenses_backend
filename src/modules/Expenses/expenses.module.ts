import { Module } from '@nestjs/common';
import { DataBaseModule } from '../Database/database.module';
import { IExpensesRepository } from './expenses.repository.interface';
import { ExpensesRepository } from './expenses.repository';
import { ExpensesService } from './expenses.service';
import { EXPENSES_REPOSITORY } from './expenses.repository.token';

@Module({
  imports: [DataBaseModule],
  providers: [
    ExpensesService,
    {
      provide: EXPENSES_REPOSITORY,
      useClass: ExpensesRepository,
    },
  ],
  exports: [ExpensesService],
})
export class ExpensesModule {}
