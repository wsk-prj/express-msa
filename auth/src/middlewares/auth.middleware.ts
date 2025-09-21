import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "@msa/http-error";
import { extractTokenFromHeader } from "@msa/authentication";
import jwt from "jsonwebtoken";

import { db } from "@/libs/db";
import { config } from "@/config";

/**
 * JWT Access Token 인증 미들웨어
 */
export const requiredAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) throw new UnauthorizedError();

    const payload = jwt.verify(token, config.JWT_SECRET) as any;
    const user = await db.user.findUnique({
      where: { id: payload.sub },
      include: { auth: true },
    });
    if (!user || !user.auth) throw new UnauthorizedError();

    req.user = {
      id: user.id,
      email: user.auth.email,
      nickname: user.nickname,
      role: user.role as any,
    };

    next();
  } catch (error) {
    throw new UnauthorizedError();
  }
};

/**
 * 선택적 인증 미들웨어 (토큰이 있으면 검증, 없으면 통과)
 */
export const optionalAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) return next();

    const payload = jwt.verify(token, config.JWT_SECRET) as any;

    const user = await db.user.findUnique({
      where: { id: payload.sub },
      include: { auth: true },
    });

    if (user && user.auth) {
      req.user = {
        id: user.id,
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
