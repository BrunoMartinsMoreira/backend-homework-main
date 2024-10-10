import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Proposal,
  ProposalStatus,
} from './repositories/entities/proposal.entity';
import { AbstractUsersRepository } from '../users/repositories';
import { AbstractProposalsRepository } from './repositories/contracts';
import { BestUser, ProfitByStatus } from './types';

@Injectable()
export class ProposalsService {
  constructor(
    private proposalsRepository: AbstractProposalsRepository,
    private usersRepository: AbstractUsersRepository,
  ) {}

  async findOne(id: number, userId: number): Promise<Proposal> {
    const proposal = await this.proposalsRepository.findOne({
      id,
      userCreator: {
        id: userId,
      },
    });

    if (!proposal) {
      throw new NotFoundException('Proposta não encontrada');
    }

    return proposal;
  }

  async findPendingByUser(userId: number): Promise<Proposal[]> {
    return this.proposalsRepository.find({
      userCreator: { id: userId },
      status: ProposalStatus.PENDING,
    });
  }

  async findRefusedByUser(userId: number): Promise<Proposal[]> {
    return this.proposalsRepository.find({
      userCreator: { id: userId },
      status: ProposalStatus.REFUSED,
    });
  }

  async approveProposal(proposalId: number, userId: number): Promise<Proposal> {
    const user = await this.usersRepository.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('usuario invalido');
    }

    const proposal = await this.findOne(proposalId, userId);

    if (!proposal) {
      throw new NotFoundException('Proposta não localizada');
    }

    if (proposal.status !== ProposalStatus.PENDING) {
      throw new ForbiddenException(
        'Apenas propostas pendentes podem ser aprovadas',
      );
    }

    user.balance += proposal.profit;
    proposal.status = ProposalStatus.SUCCESSFUL;

    await this.usersRepository.save(user);
    return this.proposalsRepository.save(proposal);
  }

  async getProfitByStatus(): Promise<ProfitByStatus[]> {
    return this.proposalsRepository.getProfitByStatus();
  }

  async getBestUsers(start: Date, end: Date): Promise<BestUser[]> {
    return this.proposalsRepository.getBestUsers(start, end);
  }
}
