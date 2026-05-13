import { BadRequestException, Injectable } from '@nestjs/common';
import { SearchUserDTO } from '../dto/search-user.dto';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';
import { PublicUser } from '../types/user.types';
import { toPublicUsers } from './user-response.mapper';

@Injectable()
export class SearchUsersService {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(filters: SearchUserDTO): Promise<PublicUser[]> {
    if (!filters.name && !filters.email) {
      throw new BadRequestException('Name or email must be provided');
    }

    const users = await this.userRepository.search(filters);

    return toPublicUsers(users);
  }
}
