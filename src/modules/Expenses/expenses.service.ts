import { Inject, Injectable } from '@nestjs/common';
import { IExpensesRepository } from './repositories/expensesRepository/expenses.repository.interface';
import { CreateExpenseDto } from './domain/expenses/dto/createExpense.dto';
import { ReturnExpenseDto } from './domain/expenses/dto/returnExpense.dto';
import { EXPENSES_REPOSITORY } from './repositories/expensesRepository/expenses.repository.token';
import { USERS_REPOSITORY } from './repositories/usersRepository/users.repository.token';
import { IUsersRepository } from './repositories/usersRepository/users.repository.interface';
import { ExpensesMapper } from './domain/expenses/expenses.mapper';
import { RegisterUserDto } from './domain/users/dto/registerUserDto';

@Injectable()
export class ExpensesService {
  constructor(
    @Inject(EXPENSES_REPOSITORY)
    private readonly expensesRepo: IExpensesRepository,
    @Inject(USERS_REPOSITORY)
    private readonly usersRepo: IUsersRepository,
  ) {}

  async create(
    dto: CreateExpenseDto,
    telegramId: number,
  ): Promise<ReturnExpenseDto> {
    const user = await this.usersRepo.findByTelegramId(telegramId);

    if (!user) {
      throw new Error('User could not be found. /start the bot.');
    }

    const createdExpense = await this.expensesRepo.create(
      ExpensesMapper.CreateExpenseRepoFromCreateExpense(dto, user.id),
    );
    return createdExpense;
  }

  async getAll(telegramId: number): Promise<ReturnExpenseDto[]> {
    const user = await this.usersRepo.findByTelegramId(telegramId);

    if (!user) {
      throw new Error('User could not be found. /start the bot.');
    }

    const expenses = await this.expensesRepo.getAll(user.id);
    return expenses;
  }

  async getById(
    id: string,
    telegramId: number,
  ): Promise<ReturnExpenseDto | null> {
    const user = await this.usersRepo.findByTelegramId(telegramId);

    if (!user) {
      throw new Error('User could not be found. /start the bot.');
    }

    const expense = await this.expensesRepo.getById(id, user.id);
    return expense;
  }

  async delete(id: string, telegramId: number): Promise<ReturnExpenseDto> {
    const user = await this.usersRepo.findByTelegramId(telegramId);

    if (!user) {
      throw new Error('User could not be found. /start the bot.');
    }

    const existsExpense = await this.expensesRepo.exists(id, user.id);
    if (!existsExpense) throw new Error('Expense was not found');

    const deletedExpense = await this.expensesRepo.delete(id, user.id);
    return deletedExpense;
  }

  async userExists(telegramId: number) {
    const userExists = await this.usersRepo.findByTelegramId(telegramId);

    return userExists;
  }

  async registerUser(dto: RegisterUserDto) {
    const user = await this.usersRepo.registerUser(
      dto.telegramId,
      dto.username,
    );

    return user;
  }
}
