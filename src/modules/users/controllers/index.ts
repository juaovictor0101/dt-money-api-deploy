import { CreateUserController } from './create-user.controller';
import { DeleteUserController } from './delete-user.controller';
import { SearchUsersController } from './search-users.controller';
import { UpdateUserController } from './update-user.controller';

export const userControllers = [
  CreateUserController,
  DeleteUserController,
  SearchUsersController,
  UpdateUserController,
];
