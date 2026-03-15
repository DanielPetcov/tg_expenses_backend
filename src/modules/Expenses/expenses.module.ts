import { Module } from '@nestjs/common';
import { DataBaseModule } from '../Database/database.module';
import { ExpensesRepository } from './repositories/expensesRepository/expenses.repository';
import { ExpensesService } from './expenses.service';
import { EXPENSES_REPOSITORY } from './repositories/expensesRepository/expenses.repository.token';
import { USERS_REPOSITORY } from './repositories/usersRepository/users.repository.token';
import { UsersRepository } from './repositories/usersRepository/users.repository';

@Module({
  imports: [DataBaseModule],
  providers: [
    ExpensesService,
    {
      provide: EXPENSES_REPOSITORY,
      useClass: ExpensesRepository,
    },
    {
      provide: USERS_REPOSITORY,
      useClass: UsersRepository,
    },
  ],
  exports: [ExpensesService],
})
export class ExpensesModule {}
