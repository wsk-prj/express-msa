import bcrypt from "bcrypt";
import { Router } from "express";
import asyncHandler from "express-async-handler";

import { ConflictError, UnauthorizedError, validateRequest } from "@msa/shared";
import { publishSignupEvent, publishLoginEvent, publishLogoutEvent } from "@/services/auth.event-pub";
import { config } from "@/config";
import { db } from "@/libs/db";
import { SignupResponse, TokenResponse } from "@/routes/auth/auth.dto";
import { CheckEmailSchema, CheckNicknameSchema, LoginSchema, SignupSchema } from "@/routes/auth/auth.schema";
import { generateAccessToken, generateRefreshToken, regenRefreshToken, verifyRefreshToken } from "@/libs/jwt";
import { requiredAuth } from "@/middlewares/auth.middleware";
import { tx } from "@/persist/transactions";
export const router = Router();

// 회원가입
router.post(
  "/signup",
  validateRequest(SignupSchema),
  asyncHandler(async (req, res, _next) => {
    const { nickname, email, password } = req.body;

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

    // 이벤트 발행
    publishSignupEvent({ userId: newUser.id });

    res.created<SignupResponse>({
      user: {
        id: newUser.id,
        nickname: newUser.nickname,
        email: newAuth.email,
      },
    });
  })
);

// 로그인
router.post(
  "/login",
  validateRequest(LoginSchema),
  asyncHandler(async (req, res, _next) => {
    const { email, password } = req.body;

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

    res.cookie(config.REFRESH_TOKEN_COOKIE_NAME, refreshToken, config.COOKIE_OPTIONS);
    res.success<TokenResponse>({ token: accessToken });
  })
);

// 로그아웃
router.post(
  "/logout",
  requiredAuth,
  asyncHandler(async (req, res, _next) => {
    await db.user.update({
      where: { id: req.user!.userId },
      data: {
        tokenVersion: {
          increment: 1,
        },
      },
    });

    res.clearCookie(config.REFRESH_TOKEN_COOKIE_NAME, config.COOKIE_OPTIONS);

    res.success();
  })
);

// 이메일 중복 체크
router.post(
  "/check/email",
  validateRequest(CheckEmailSchema),
  asyncHandler(async (req, res, _next) => {
    const { email } = req.body;

    const auth = await db.auth.findUnique({ where: { email } });
    if (auth) throw new ConflictError();

    res.success({ message: "Email is available" });
  })
);

// 닉네임 중복 체크
router.post(
  "/check/nickname",
  validateRequest(CheckNicknameSchema),
  asyncHandler(async (req, res, _next) => {
    const { nickname } = req.body;

    const user = await db.user.findUnique({ where: { nickname } });
    if (user) throw new ConflictError();

    res.success({ message: "Nickname is available" });
  })
);

// Access Token 갱신
router.post(
  "/refresh",
  asyncHandler(async (req, res, _next) => {
    const refreshToken = req.cookies[config.REFRESH_TOKEN_COOKIE_NAME];
    if (!refreshToken) throw new UnauthorizedError();

    const payload = verifyRefreshToken(refreshToken);
    const dbAuth = await db.auth.findUnique({
      where: { id: payload.userId },
      include: { user: true },
    });
    const user = dbAuth?.user;
    if (!user) throw new UnauthorizedError();
    if (user.tokenVersion !== payload.tokenVersion) throw new UnauthorizedError();

    const accessToken = generateAccessToken({
      userId: user.id,
      nickname: user.nickname,
      email: dbAuth.email,
    });

    const newRefreshToken = regenRefreshToken(refreshToken, user);
    res.cookie(config.REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, config.COOKIE_OPTIONS);

    res.success<TokenResponse>({ token: accessToken });
  })
);
