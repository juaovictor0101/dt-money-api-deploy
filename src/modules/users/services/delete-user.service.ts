import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';

@Injectable()
export class DeleteUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(id);
  }
}
