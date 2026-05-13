import { CreateUserService } from './create-user.service';
import { DeleteUserService } from './delete-user.service';
import { SearchUsersService } from './search-users.service';
import { UpdateUserService } from './update-user.service';

export const userServices = [
  CreateUserService,
  DeleteUserService,
  SearchUsersService,
  UpdateUserService,
];
