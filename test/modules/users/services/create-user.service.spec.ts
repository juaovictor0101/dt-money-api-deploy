import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from '../../../../src/modules/users/dto/create-user.dto';
import { IUserRepository } from '../../../../src/modules/users/infra/repositories/user.repository.abstract';
import { CreateUserService } from '../../../../src/modules/users/services/create-user.service';
import { UserRecord } from '../../../../src/modules/users/types/user.types';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('CreateUserService', () => {
  let service: CreateUserService;

  const userRepository = {
    create: jest.fn(),
    findByEmail: jest.fn(),
  };

  const createUserDTO: CreateUserDTO = {
    name: 'Maria Silva',
    email: 'maria@example.com',
    password: 'strongPassword123',
  };

  const createdUser: UserRecord = {
    id: 'user-id',
    name: createUserDTO.name,
    email: createUserDTO.email,
    password: 'hashed-password',
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
    updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        {
          provide: IUserRepository,
          useValue: userRepository,
        },
      ],
    }).compile();

    service = module.get<CreateUserService>(CreateUserService);
    jest.clearAllMocks();
  });

  it('creates a user with hashed password and returns the user without password', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    userRepository.create.mockResolvedValue(createdUser);
    jest.mocked(bcrypt.hash).mockResolvedValue('hashed-password' as never);

    const result = await service.execute(createUserDTO);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(createUserDTO.email);
    expect(bcrypt.hash).toHaveBeenCalledWith(createUserDTO.password, 10);
    expect(userRepository.create).toHaveBeenCalledWith({
      ...createUserDTO,
      password: 'hashed-password',
    });
    expect(result).toEqual({
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      createdAt: createdUser.createdAt,
      updatedAt: createdUser.updatedAt,
    });
    expect(result).not.toHaveProperty('password');
  });

  it('throws ConflictException when email is already registered', async () => {
    userRepository.findByEmail.mockResolvedValue(createdUser);

    await expect(service.execute(createUserDTO)).rejects.toThrow(ConflictException);
    expect(userRepository.create).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
  });
});
