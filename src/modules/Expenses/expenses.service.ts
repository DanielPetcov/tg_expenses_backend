import { Injectable } from '@nestjs/common';
import { IExpensesRepository } from './expenses.repository.interface';

@Injectable()
export class ExpensesService {
  constructor(private readonly _repo: IExpensesRepository) {}
}
