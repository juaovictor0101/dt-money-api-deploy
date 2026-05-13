import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from '../dto/create-user.dto';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';
import { PublicUser } from '../types/user.types';
import { toPublicUser } from './user-response.mapper';

@Injectable()
export class CreateUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: CreateUserDTO): Promise<PublicUser> {
    const userWithSameEmail = await this.userRepository.findByEmail(data.email);

    if (userWithSameEmail) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return toPublicUser(user);
  }
}
