import { FindOptionsWhere } from 'typeorm';
import { User } from '../entities/user.entity';

export type UsersCriteria = FindOptionsWhere<User>;
