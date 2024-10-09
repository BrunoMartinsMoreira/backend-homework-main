import { User } from '../entities/user.entity';

export abstract class AbstractUsersRepository {
  findOne: (criteria: Partial<User>) => Promise<User | null>;
}
