import { ReturnUserDto } from './dto/returnUser.dto';
import { UserEntity } from './users.entity';

export class UsersMapper {
  static ReturnDtoFromDrizzle(drizzleEntity: UserEntity): ReturnUserDto {
    return {
      id: drizzleEntity.id,
      telegramId: drizzleEntity.telegramId,
      username: drizzleEntity.username,
    };
  }
}
