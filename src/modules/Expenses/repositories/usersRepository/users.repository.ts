import { Injectable } from '@nestjs/common';
import { IUsersRepository } from './users.repository.interface';
import { DatabaseService } from 'src/modules/Database/database.service';
import { usersTable } from 'src/modules/Database/schemas';
import { eq } from 'drizzle-orm';
import { UsersMapper } from '../../domain/users/users.mapper';
import { ReturnUserDto } from '../../domain/users/dto/returnUser.dto';
import { getSingleOrError } from '../../common/getSingleOrError';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private readonly _db: DatabaseService) {}
  async registerUser(
    telegramId: number,
    username: string,
  ): Promise<ReturnUserDto> {
    const returnedUsers = await this._db.db
      .insert(usersTable)
      .values({
        telegramId: telegramId,
        username: username,
      })
      .returning();

    const user = getSingleOrError(returnedUsers, 'User cound not be created');

    return UsersMapper.ReturnDtoFromDrizzle(user);
  }

  async findByTelegramId(telegramId: number) {
    const returnedUsers = await this._db.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.telegramId, telegramId));

    if (returnedUsers.length === 0) {
      return null;
    }

    return UsersMapper.ReturnDtoFromDrizzle(returnedUsers[0]);
  }
}
