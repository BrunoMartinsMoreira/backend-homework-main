import { Module } from '@nestjs/common';
import { AbstractUsersRepository } from './repositories';
import { TypeOrmUsersRespository } from './repositories/implementations/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './repositories/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    {
      provide: AbstractUsersRepository,
      useClass: TypeOrmUsersRespository,
    },
  ],
  exports: [
    {
      provide: AbstractUsersRepository,
      useClass: TypeOrmUsersRespository,
    },
  ],
})
export class UsersModule {}
