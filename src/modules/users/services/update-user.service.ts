import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';
import { PublicUser } from '../types/user.types';
import { toPublicUser } from './user-response.mapper';

@Injectable()
export class UpdateUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, data: UpdateUserDTO): Promise<PublicUser> {
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    if (data.email && data.email !== existingUser.email) {
      const userWithSameEmail = await this.userRepository.findByEmail(data.email);

      if (userWithSameEmail) {
        throw new ConflictException('Email already registered');
      }
    }

    const updateData = { ...data };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updatedUser = await this.userRepository.update(id, updateData);

    return toPublicUser(updatedUser);
  }
}
