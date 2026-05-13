import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IUserRepository } from '../../../../src/modules/users/infra/repositories/user.repository.abstract';
import { SearchUsersService } from '../../../../src/modules/users/services/search-users.service';
import { UserRecord } from '../../../../src/modules/users/types/user.types';

describe('SearchUsersService', () => {
  let service: SearchUsersService;

  const userRepository = {
    search: jest.fn(),
  };

  const user: UserRecord = {
    id: 'user-id',
    name: 'Maria Silva',
    email: 'maria@example.com',
    password: 'hashed-password',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchUsersService,
        {
          provide: IUserRepository,
          useValue: userRepository,
        },
      ],
    }).compile();

    service = module.get<SearchUsersService>(SearchUsersService);
    jest.clearAllMocks();
  });

  it('searches users by name and returns users without password', async () => {
    userRepository.search.mockResolvedValue([user]);

    const result = await service.execute({ name: 'Maria' });

    expect(userRepository.search).toHaveBeenCalledWith({ name: 'Maria' });
    expect(result).toHaveLength(1);
    expect(result[0]).not.toHaveProperty('password');
    expect(result[0]).toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  });

  it('searches users by email', async () => {
    userRepository.search.mockResolvedValue([user]);

    const result = await service.execute({ email: 'maria@example.com' });

    expect(userRepository.search).toHaveBeenCalledWith({ email: 'maria@example.com' });
    expect(result).toHaveLength(1);
  });

  it('throws BadRequestException when name and email are missing', async () => {
    await expect(service.execute({})).rejects.toThrow(BadRequestException);
    expect(userRepository.search).not.toHaveBeenCalled();
  });
});
