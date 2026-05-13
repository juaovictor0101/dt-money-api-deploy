import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from '../../../../src/modules/users/infra/repositories/user.repository.abstract';
import { UpdateUserService } from '../../../../src/modules/users/services/update-user.service';
import { UserRecord } from '../../../../src/modules/users/types/user.types';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('UpdateUserService', () => {
  let service: UpdateUserService;

  const userRepository = {
    update: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
  };

  const existingUser: UserRecord = {
    id: 'user-id',
    name: 'Maria Silva',
    email: 'maria@example.com',
    password: 'current-hash',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserService,
        {
          provide: IUserRepository,
          useValue: userRepository,
        },
      ],
    }).compile();

    service = module.get<UpdateUserService>(UpdateUserService);
    jest.clearAllMocks();
  });

  it('updates name and email without hashing password when password is not provided', async () => {
    const updateData = {
      name: 'Maria Souza',
      email: 'maria.souza@example.com',
    };
    const updatedUser = {
      ...existingUser,
      ...updateData,
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    userRepository.findById.mockResolvedValue(existingUser);
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.update.mockResolvedValue(updatedUser);

    const result = await service.execute(existingUser.id, updateData);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(updateData.email);
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(userRepository.update).toHaveBeenCalledWith(existingUser.id, updateData);
    expect(result).not.toHaveProperty('password');
    expect(result).toEqual({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
  });

  it('updates password using a new hash when password is provided', async () => {
    const updateData = {
      password: 'newStrongPassword123',
    };
    const updatedUser = {
      ...existingUser,
      password: 'new-hash',
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    userRepository.findById.mockResolvedValue(existingUser);
    userRepository.update.mockResolvedValue(updatedUser);
    jest.mocked(bcrypt.hash).mockResolvedValue('new-hash' as never);

    const result = await service.execute(existingUser.id, updateData);

    expect(bcrypt.hash).toHaveBeenCalledWith(updateData.password, 10);
    expect(userRepository.update).toHaveBeenCalledWith(existingUser.id, {
      password: 'new-hash',
    });
    expect(result).not.toHaveProperty('password');
  });

  it('throws NotFoundException when user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(service.execute('missing-id', { name: 'Missing' })).rejects.toThrow(NotFoundException);
    expect(userRepository.update).not.toHaveBeenCalled();
  });

  it('throws ConflictException when updated email is already registered by another user', async () => {
    userRepository.findById.mockResolvedValue(existingUser);
    userRepository.findByEmail.mockResolvedValue({
      ...existingUser,
      id: 'another-user-id',
      email: 'used@example.com',
    });

    await expect(service.execute(existingUser.id, { email: 'used@example.com' })).rejects.toThrow(ConflictException);
    expect(userRepository.update).not.toHaveBeenCalled();
  });
});
