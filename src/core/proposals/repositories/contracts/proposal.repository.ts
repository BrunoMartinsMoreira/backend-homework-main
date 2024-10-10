import { BestUser, ProfitByStatus } from '../../types';
import { Proposal } from '../entities/proposal.entity';
import { ProposalCriteria } from './types';

export abstract class AbstractProposalsRepository {
  findOne: (criteria: ProposalCriteria) => Promise<Proposal | null>;
  find: (criteria: ProposalCriteria) => Promise<Proposal[]>;
  save: (proposal: Partial<Proposal>) => Promise<Proposal>;
  getProfitByStatus: () => Promise<ProfitByStatus[]>;
  getBestUsers: (startDate: Date, endDate: Date) => Promise<BestUser[]>;
}
