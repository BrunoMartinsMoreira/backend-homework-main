import { InjectRepository } from '@nestjs/typeorm';
import { AbstractProposalsRepository, ProposalCriteria } from '../contracts';
import { Proposal, ProposalStatus } from '../entities/proposal.entity';
import { Repository } from 'typeorm';
import { BestUser, ProfitByStatus } from '../../types';

export class TypeOrmProposalRepository implements AbstractProposalsRepository {
  constructor(
    @InjectRepository(Proposal)
    private readonly repository: Repository<Proposal>,
  ) {}

  async findOne(criteria: ProposalCriteria): Promise<Proposal | null> {
    const proposal = await this.repository.findOne({
      where: criteria,
    });

    return proposal;
  }

  async find(criteria: ProposalCriteria): Promise<Proposal[]> {
    return this.repository.find({
      where: criteria,
    });
  }

  async save(proposal: Partial<Proposal>): Promise<Proposal> {
    return this.repository.save(proposal);
  }

  async getProfitByStatus(): Promise<ProfitByStatus[]> {
    return this.repository
      .createQueryBuilder('proposal')
      .select([
        'userCreator.id as userId',
        'userCreator.name as fullName',
        'proposal.status as status',
        'SUM(proposal.profit) as totalProfit',
      ])
      .leftJoin('proposal.userCreator', 'userCreator')
      .groupBy('userCreator.id')
      .addGroupBy('proposal.status')
      .getRawMany();
  }

  async getBestUsers(startDate: Date, endDate: Date): Promise<BestUser[]> {
    return this.repository
      .createQueryBuilder('proposal')
      .select([
        'userCreator.id as id',
        'userCreator.name as fullName',
        'SUM(proposal.profit) as totalProposal',
      ])
      .leftJoin('proposal.userCreator', 'userCreator')
      .where({
        status: ProposalStatus.SUCCESSFUL,
      })
      .andWhere(
        'DATE(proposal.createdAt) BETWEEN DATE(:startDate) AND DATE(:endDate)',
        { startDate, endDate },
      )
      .groupBy('userCreator.id')
      .orderBy('totalProposal', 'DESC')
      .getRawMany();
  }
}
