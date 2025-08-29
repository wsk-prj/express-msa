import { NextFunction, Request, Response } from "express";

import { UnauthorizedError } from "@msa/http-error";
import { db } from "@/libs/db";
import { verifyAccessToken, extractTokenFromHeader } from "@/libs/jwt";

/**
 * JWT Access Token 인증 미들웨어
 */
export const requiredAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) throw new UnauthorizedError();

    const payload = verifyAccessToken(token);
    const user = await db.user.findUnique({
      where: { id: payload.userId },
      include: { auth: true },
    });
    if (!user || !user.auth) throw new UnauthorizedError();

    req.user = {
      userId: user.id,
      email: user.auth.email,
      nickname: user.nickname,
    };

    next();
  } catch (error) {
    throw new UnauthorizedError();
  }
};

/**
 * 선택적 인증 미들웨어 (토큰이 있으면 검증, 없으면 통과)
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) return next();

    const payload = verifyAccessToken(token);

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      include: { auth: true },
    });

    if (user && user.auth) {
      req.user = {
        userId: user.id,
        email: user.auth.email,
        nickname: user.nickname,
      };
    }

    next();
  } catch (error) {
    // 토큰이 유효하지 않아도 통과 (선택적 인증이므로)
    next();
  }
};
