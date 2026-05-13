export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PublicUser = Omit<UserRecord, 'password'>;

export interface SearchUserFilters {
  name?: string;
  email?: string;
}
