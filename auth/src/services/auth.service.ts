import { ConflictError, UnauthorizedError } from "@msa/http-error";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, updateRefreshToken } from "@msa/authentication";

import { db } from "@/libs/db";
import { SignupDto, LoginDto, CheckEmailDto, CheckNicknameDto } from "@/routes/auth/auth.dto";

export const authService = {
  signup: async (data: SignupDto) => {
    const { nickname, email, password } = data;

    const existUser = await db.user.findUnique({ where: { nickname } });
    if (existUser) throw new ConflictError();
    const existAuth = await db.auth.findUnique({ where: { email } });

    if (existAuth) throw new ConflictError();

    const hashedPassword = await bcrypt.hash(password, 12);

    const { user: newUser, auth: newAuth } = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          nickname,
          tokenVersion: 0, // 초기 토큰 버전
        },
      });

      const auth = await tx.auth.create({
        data: {
          email,
          password: hashedPassword,
          userId: user.id,
        },
      });

      return { user, auth };
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
      sub: dbAuth.user.id,
      email: dbAuth.email,
      nickname: dbAuth.user.nickname,
      role: dbAuth.user.role,
    });

    const refreshToken = generateRefreshToken({
      sub: dbAuth.user.id,
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

    const dbAuth = await db.auth.findUnique({ where: { id: payload.sub }, include: { user: true } });
    if (!dbAuth || !dbAuth.user) throw new UnauthorizedError();
    if (dbAuth.user.tokenVersion !== payload.tokenVersion) throw new UnauthorizedError();

    return {
      accessToken: generateAccessToken({ sub: dbAuth.user.id, nickname: dbAuth.user.nickname, email: dbAuth.email }),
      refreshToken: updateRefreshToken(refreshToken, { sub: dbAuth.user.id, tokenVersion: dbAuth.user.tokenVersion }),
    };
  },
};
