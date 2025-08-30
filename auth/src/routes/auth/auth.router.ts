import { Router } from "express";

import { validateRequest } from "@msa/shared";
import { publishSignupEvent } from "@/services/auth.event-pub";
import { config } from "@/config";
import { SignupResponse, TokenResponse } from "@/routes/auth/auth.dto";
import { CheckEmailSchema, CheckNicknameSchema, LoginSchema, SignupSchema } from "@/routes/auth/auth.dto";
import { requiredAuth } from "@/middlewares/auth.middleware";
import { authService } from "@/services/auth.service";

const router = Router();

// 회원가입
router.post("/signup", validateRequest(SignupSchema), async (req, res, _next) => {
  const { user: newUser, auth: newAuth } = await authService.signup(req.body);

  publishSignupEvent({ userId: newUser.id });

  res.created<SignupResponse>({
    user: {
      id: newUser.id,
      nickname: newUser.nickname,
      email: newAuth.email,
    },
  });
});

// 로그인
router.post("/login", validateRequest(LoginSchema), async (req, res, _next) => {
  const { accessToken, refreshToken } = await authService.login(req.body);

  res.cookie(config.REFRESH_TOKEN_COOKIE_NAME, refreshToken, config.COOKIE_OPTIONS);
  res.success<TokenResponse>({ token: accessToken });
});

// 로그아웃
router.post("/logout", requiredAuth, async (req, res, _next) => {
  await authService.logout(req.user!.userId);

  res.clearCookie(config.REFRESH_TOKEN_COOKIE_NAME, config.COOKIE_OPTIONS);

  res.success();
});

// 이메일 중복 체크
router.post("/check/email", validateRequest(CheckEmailSchema), async (req, res, _next) => {
  await authService.checkEmail(req.body);

  res.success({ message: "Email is available" });
});

// 닉네임 중복 체크
router.post("/check/nickname", validateRequest(CheckNicknameSchema), async (req, res, _next) => {
  await authService.checkNickname(req.body);

  res.success({ message: "Nickname is available" });
});

// Access Token 갱신
router.post("/refresh", async (req, res, _next) => {
  const refreshToken = req.cookies[config.REFRESH_TOKEN_COOKIE_NAME];
  const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(refreshToken);

  res.cookie(config.REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, config.COOKIE_OPTIONS);
  res.success<TokenResponse>({ token: accessToken });
});

export { router as authRouter };
