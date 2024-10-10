export enum ProposalStatus {
  PENDING = 'PENDING',
  REFUSED = 'REFUSED',
  ERROR = 'ERROR',
  SUCCESSFUL = 'SUCCESSFUL',
}

export interface ProfitByStatus {
  userId: number;
  fullName: string;
  status: ProposalStatus;
  totalProfit: number;
}

export interface BestUser {
  id: number;
  fullName: string;
  totalProposal: number;
}
