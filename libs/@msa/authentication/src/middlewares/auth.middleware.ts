import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "@msa/http-error";
import { extractToken } from "../utils/token.util";
import { extractAuthUserFromToken } from "../utils/jwt.util";

/**
 * JWT 토큰을 검증하는 인증 미들웨어
 */
export function authMiddleware() {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = extractToken(req);

      if (!token) {
        throw new UnauthorizedError("Token is required");
      }

      // JWT 토큰 검증 (클로저로 jwtConfig 사용)
      const user = extractAuthUserFromToken(token);
      req.user = user;
      next();
    } catch (error) {
      if (error instanceof Error) {
        next(new UnauthorizedError(error.message));
      } else {
        next(new UnauthorizedError("Authentication failed"));
      }
    }
  };
}

/**
 * 선택적 인증 미들웨어 (토큰이 없어도 통과)
 */
export function optionalAuthMiddleware() {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const token = extractToken(req);

      if (token) {
        // JWT 토큰 검증 (클로저로 jwtConfig 사용)
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
