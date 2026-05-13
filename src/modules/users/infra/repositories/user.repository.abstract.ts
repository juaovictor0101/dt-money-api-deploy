import { CreateUserDTO } from '../../dto/create-user.dto';
import { UpdateUserDTO } from '../../dto/update-user.dto';
import { SearchUserFilters, UserRecord } from '../../types/user.types';

export abstract class IUserRepository {
  abstract create(data: CreateUserDTO): Promise<UserRecord>;
  abstract update(id: string, data: UpdateUserDTO): Promise<UserRecord>;
  abstract findById(id: string): Promise<UserRecord | null>;
  abstract findByEmail(email: string): Promise<UserRecord | null>;
  abstract search(filters: SearchUserFilters): Promise<UserRecord[]>;
  abstract delete(id: string): Promise<void>;
}
