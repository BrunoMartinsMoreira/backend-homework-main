import {
  Controller,
  Get,
  Post,
  Param,
  Req,
  Query,
  Catch,
} from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { Request } from 'express';
import { DateRangeDto } from './dto/date-range.dto';

@Controller()
@Catch()
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Get('proposals')
  async getPendingProposals(@Req() req: Request) {
    return this.proposalsService.findPendingByUser(req.user.id);
  }

  @Get('proposals/refused')
  async getRefusedProposals(@Req() req: Request) {
    return this.proposalsService.findRefusedByUser(req.user.id);
  }

  @Get('proposals/:id')
  async getProposal(@Param('id') id: string, @Req() req: Request) {
    return this.proposalsService.findOne(Number(id), req.user.id);
  }

  @Post('proposals/:proposal_id/approve')
  async approveProposal(
    @Param('proposal_id') proposalId: string,
    @Req() req: Request,
  ) {
    return this.proposalsService.approveProposal(
      Number(proposalId),
      req.user.id,
    );
  }

  @Get('admin/profit-by-status')
  async getProfitByStatus() {
    return this.proposalsService.getProfitByStatus();
  }

  @Get('admin/best-users')
  async getBestUsers(@Query() dateRange: DateRangeDto) {
    return this.proposalsService.getBestUsers(
      new Date(dateRange.start),
      new Date(dateRange.end),
    );
  }
}
