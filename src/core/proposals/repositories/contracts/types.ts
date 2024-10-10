import { Proposal } from '../entities/proposal.entity';
import { FindOptionsWhere } from 'typeorm';

export type ProposalCriteria = FindOptionsWhere<Proposal>;
