import { ConflictError, UnauthorizedError } from "@msa/http-error";
import bcrypt from "bcrypt";

import { db } from "@/libs/db";
import { SignupDto, LoginDto, CheckEmailDto, CheckNicknameDto } from "@/routes/auth/auth.dto";
import { tx } from "@/persist/auth.transaction";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "@/libs/jwt";

export const authService = {
  signup: async (data: SignupDto) => {
    const { nickname, email, password } = data;

    const existUser = await db.user.findUnique({ where: { nickname } });
    if (existUser) throw new ConflictError();
    const existAuth = await db.auth.findUnique({ where: { email } });

    if (existAuth) throw new ConflictError();

    const hashedPassword = await bcrypt.hash(password, 12);
    const { user: newUser, auth: newAuth } = await tx.signup({
      nickname,
      email,
      password: hashedPassword,
    });

    return {
      user: newUser,
      auth: newAuth,
    };
  },

  login: async (data: LoginDto) => {
    const { email, password } = data;

    const dbAuth = await db.auth.findUnique({
      where: { email },
      include: { user: true },
    });
    if (!dbAuth || !dbAuth.user) throw new UnauthorizedError();

    const isPasswordValid = await bcrypt.compare(password, dbAuth.password);
    if (!isPasswordValid) throw new UnauthorizedError();

    const accessToken = generateAccessToken({
      userId: dbAuth.user.id,
      email: dbAuth.email,
      nickname: dbAuth.user.nickname,
    });
    const refreshToken = generateRefreshToken({
      userId: dbAuth.user.id,
      tokenVersion: dbAuth.user.tokenVersion,
    });

    return {
      accessToken,
      refreshToken,
    };
  },

  logout: async (userId: number) => {
    await db.user.update({
      where: { id: userId },
      data: {
        tokenVersion: {
          increment: 1,
        },
      },
    });
  },

  checkEmail: async (data: CheckEmailDto) => {
    const { email } = data;
    const auth = await db.auth.findUnique({ where: { email } });
    if (auth) throw new ConflictError();
  },

  checkNickname: async (data: CheckNicknameDto) => {
    const { nickname } = data;
    const user = await db.user.findUnique({ where: { nickname } });
    if (user) throw new ConflictError();
  },

  refresh: async (refreshToken: string) => {
    if (!refreshToken) throw new UnauthorizedError();
    const payload = verifyRefreshToken(refreshToken);

    const dbAuth = await db.auth.findUnique({ where: { id: payload.userId }, include: { user: true } });
    if (!dbAuth || !dbAuth.user) throw new UnauthorizedError();
    if (dbAuth.user.tokenVersion !== payload.tokenVersion) throw new UnauthorizedError();

    return {
      accessToken: generateAccessToken({ userId: dbAuth.user.id, nickname: dbAuth.user.nickname, email: dbAuth.email }),
      refreshToken: generateRefreshToken({ userId: dbAuth.user.id, tokenVersion: dbAuth.user.tokenVersion }),
    };
  },
};
