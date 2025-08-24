import { User, Auth } from "@prisma/client";

export type SignupResponse = Pick<User, "id" | "nickname"> & Pick<Auth, "email">;

export type TokenResponse = {
  token: string;
};
