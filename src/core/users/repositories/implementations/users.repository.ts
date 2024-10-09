import { InjectRepository } from '@nestjs/typeorm';
import { AbstractUsersRepository } from '../contracts';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

export class TypeOrmUsersRespository implements AbstractUsersRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async findOne(criteria: Partial<User>): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: criteria,
    });

    return user;
  }
}
