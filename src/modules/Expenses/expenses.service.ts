import { Injectable } from '@nestjs/common';
import { IExpensesRepository } from './expenses.repository.interface';
import { CreateExpenseDto } from './domain/dto/createExpense.dto';
import { ReturnExpenseDto } from './domain/dto/returnExpense.dto';

@Injectable()
export class ExpensesService {
  constructor(private readonly _repo: IExpensesRepository) {}

  async create(dto: CreateExpenseDto): Promise<ReturnExpenseDto> {
    const createdExpense = await this._repo.create(dto);
    return createdExpense;
  }

  async getAll(): Promise<ReturnExpenseDto[]> {
    const expenses = await this._repo.getAll();
    return expenses;
  }

  async getById(id: string): Promise<ReturnExpenseDto | null> {
    const expense = await this._repo.getById(id);
    return expense;
  }
  async delete(id: string): Promise<ReturnExpenseDto> {
    const existsExpense = await this._repo.exists(id);
    if (!existsExpense) throw new Error('Expense was not found');

    const deletedExpense = await this._repo.delete(id);
    return deletedExpense;
  }
}
