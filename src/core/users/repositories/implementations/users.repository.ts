import { InjectRepository } from '@nestjs/typeorm';
import { AbstractUsersRepository } from '../contracts';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UsersCriteria } from '../contracts/types';

export class TypeOrmUsersRespository implements AbstractUsersRepository {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  async findOne(criteria: UsersCriteria): Promise<User | null> {
    const user = await this.repository.findOne({
      where: criteria,
    });

    return user;
  }

  async save(user: Partial<User>): Promise<User> {
    return this.repository.save(user);
  }
}
