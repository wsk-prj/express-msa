import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "@msa/http-error";
import { extractToken } from "../utils/token.util";
import { extractAuthUserFromToken } from "../utils/jwt.util";

/**
 * JWT 토큰을 검증하는 인증 미들웨어
 */
export function requireAuth() {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = extractToken(req);
      if (!token) throw new UnauthorizedError("Token required");

      const user = extractAuthUserFromToken(token);
      req.user = user;

      next();
    } catch (error) {
      throw new UnauthorizedError();
    }
  };
}

/**
 * 선택적 인증 미들웨어 (토큰이 없어도 통과)
 */
export function requireAuthOptional() {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = extractToken(req);

      if (token) {
        const user = extractAuthUserFromToken(token);
        req.user = user;
      }

      next();
    } catch (error) {
      // 토큰이 유효하지 않아도 통과 (선택적 인증)
      next();
    }
  };
}
