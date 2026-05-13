import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma.service';
import { CreateUserDTO } from '../../../dto/create-user.dto';
import { UpdateUserDTO } from '../../../dto/update-user.dto';
import { SearchUserFilters } from '../../../types/user.types';
import { IUserRepository } from '../user.repository.abstract';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDTO) {
    return this.prisma.user.create({ data });
  }

  async update(id: string, data: UpdateUserDTO) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async search(filters: SearchUserFilters) {
    const where =
      filters.name && filters.email
        ? {
            OR: [
              {
                name: {
                  contains: filters.name,
                  mode: 'insensitive' as const,
                },
              },
              { email: filters.email },
            ],
          }
        : filters.name
          ? {
              name: {
                contains: filters.name,
                mode: 'insensitive' as const,
              },
            }
          : {
              email: filters.email,
            };

    return this.prisma.user.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async delete(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
