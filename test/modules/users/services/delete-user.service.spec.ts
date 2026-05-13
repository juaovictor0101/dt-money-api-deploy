import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IUserRepository } from '../../../../src/modules/users/infra/repositories/user.repository.abstract';
import { DeleteUserService } from '../../../../src/modules/users/services/delete-user.service';
import { UserRecord } from '../../../../src/modules/users/types/user.types';

describe('DeleteUserService', () => {
  let service: DeleteUserService;

  const userRepository = {
    delete: jest.fn(),
    findById: jest.fn(),
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
        DeleteUserService,
        {
          provide: IUserRepository,
          useValue: userRepository,
        },
      ],
    }).compile();

    service = module.get<DeleteUserService>(DeleteUserService);
    jest.clearAllMocks();
  });

  it('deletes an existing user', async () => {
    userRepository.findById.mockResolvedValue(user);
    userRepository.delete.mockResolvedValue(undefined);

    await service.execute(user.id);

    expect(userRepository.findById).toHaveBeenCalledWith(user.id);
    expect(userRepository.delete).toHaveBeenCalledWith(user.id);
  });

  it('throws NotFoundException when user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(service.execute('missing-id')).rejects.toThrow(NotFoundException);
    expect(userRepository.delete).not.toHaveBeenCalled();
  });
});
