import { User } from '../entities/user.entity';
import { UsersCriteria } from './types';

export abstract class AbstractUsersRepository {
  findOne: (criteria: UsersCriteria) => Promise<User | null>;
  save: (proposal: Partial<User>) => Promise<User>;
}
