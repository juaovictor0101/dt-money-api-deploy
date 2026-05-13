import { PublicUser, UserRecord } from '../types/user.types';

export function toPublicUser(user: UserRecord): PublicUser {
  const { password, ...publicUser } = user;
  return publicUser;
}

export function toPublicUsers(users: UserRecord[]): PublicUser[] {
  return users.map(toPublicUser);
}
