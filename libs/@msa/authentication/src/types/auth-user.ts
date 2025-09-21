export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface AuthUser {
  id: number;
  email: string;
  nickname: string;
  role: UserRole;
}
