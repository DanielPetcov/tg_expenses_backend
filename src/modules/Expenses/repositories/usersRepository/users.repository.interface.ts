import { ReturnUserDto } from '../../domain/users/dto/returnUser.dto';

export abstract class IUsersRepository {
  abstract findByTelegramId(telegramId: number): Promise<ReturnUserDto | null>;
  abstract registerUser(
    telegramId: number,
    username: string,
  ): Promise<ReturnUserDto>;
}
