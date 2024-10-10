import { Module } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { ProposalsController } from './proposals.controller';
import { AbstractProposalsRepository } from './repositories/contracts';
import { TypeOrmProposalRepository } from './repositories/implementations';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proposal } from './repositories/entities/proposal.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Proposal]), UsersModule],
  controllers: [ProposalsController],
  providers: [
    ProposalsService,
    {
      provide: AbstractProposalsRepository,
      useClass: TypeOrmProposalRepository,
    },
  ],
})
export class ProposalsModule {}
