import { Test, TestingModule } from '@nestjs/testing';
import { ProposalsService } from '../proposals.service';
import { AbstractProposalsRepository } from '../repositories/contracts';
import { AbstractUsersRepository } from '../../users/repositories';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('ProposalsService', () => {
  let service: ProposalsService;
  let proposalsRepository: jest.Mocked<AbstractProposalsRepository>;
  let usersRepository: jest.Mocked<AbstractUsersRepository>;

  const mockUser: any = {
    id: 1,
    name: 'Mason Blackwood',
    balance: 1000,
    createdAt: '2023-11-23T07:34:36.000Z',
    updatedAt: '2023-11-23T07:34:36.000Z',
  };

  const mockProposal: any = {
    id: 1,
    profit: 123,
    status: 'PENDING',
    createdAt: '2024-01-01T22:20:00.000Z',
    updatedAt: '2024-01-01T22:20:00.000Z',
    userCreator: mockUser,
    customer: null,
  };

  beforeEach(async () => {
    proposalsRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
      getProfitByStatus: jest.fn(),
      getBestUsers: jest.fn(),
      find: jest.fn(),
    };

    usersRepository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProposalsService,
        {
          provide: AbstractProposalsRepository,
          useValue: proposalsRepository,
        },
        {
          provide: AbstractUsersRepository,
          useValue: usersRepository,
        },
      ],
    }).compile();

    service = module.get<ProposalsService>(ProposalsService);
  });

  describe('findOne', () => {
    it('should throw NotFoundException when proposal does not exist', async () => {
      const spy = jest
        .spyOn(proposalsRepository, 'findOne')
        .mockResolvedValue(null);

      await expect(service.findOne(1, 1)).rejects.toThrow(NotFoundException);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('Should return an proposal if is found', async () => {
      const spy = jest
        .spyOn(proposalsRepository, 'findOne')
        .mockResolvedValue(mockProposal as any);

      const result = await service.findOne(1, 1);
      expect(result).toEqual(mockProposal);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('findPendingByUser', () => {
    it('should return an empty array if proposals are not found', async () => {
      const spy = jest.spyOn(proposalsRepository, 'find').mockResolvedValue([]);

      const result = await service.findPendingByUser(1);
      expect(result.length).toEqual(0);
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should return an array of proposals', async () => {
      const spy = jest
        .spyOn(proposalsRepository, 'find')
        .mockResolvedValue([mockProposal as any]);

      const result = await service.findPendingByUser(1);
      expect(result.length).toEqual(1);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('approveProposal', () => {
    it('should throw an error if user is not found', async () => {
      const spy = jest
        .spyOn(usersRepository, 'findOne')
        .mockResolvedValue(null);

      await expect(service.approveProposal(1, 1)).rejects.toThrow(
        NotFoundException,
      );
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if proposal is not found', async () => {
      const usersSpy = jest
        .spyOn(usersRepository, 'findOne')
        .mockResolvedValue(mockUser);

      const spy = jest
        .spyOn(proposalsRepository, 'findOne')
        .mockResolvedValue(null);

      await expect(service.approveProposal(1, 1)).rejects.toThrow(
        NotFoundException,
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(usersSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if proposal status is not equal PENDING', async () => {
      const usersSpy = jest
        .spyOn(usersRepository, 'findOne')
        .mockResolvedValue(mockUser);

      const spy = jest
        .spyOn(proposalsRepository, 'findOne')
        .mockResolvedValue({ ...mockProposal, status: 'SUCCESSFUL' } as any);

      await expect(service.approveProposal(1, 1)).rejects.toThrow(
        ForbiddenException,
      );
      expect(spy).toHaveBeenCalledTimes(1);
      expect(usersSpy).toHaveBeenCalledTimes(1);
    });

    it('should save correctly user and proposal data', async () => {
      const user = { ...mockUser };
      const proposal = { ...mockProposal };

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockUser);

      jest
        .spyOn(proposalsRepository, 'findOne')
        .mockResolvedValue(mockProposal);

      const usersSpy = jest
        .spyOn(usersRepository, 'save')
        .mockResolvedValue(mockUser);

      const spy = jest
        .spyOn(proposalsRepository, 'save')
        .mockResolvedValue(mockProposal);

      const result = await service.approveProposal(1, 1);
      const total = proposal.profit + user.balance;

      expect(result.userCreator.balance).toEqual(total);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(usersSpy).toHaveBeenCalledTimes(1);
    });
  });
});
