import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "@msa/http-error";
import { UserRole } from "../types/auth-user";

const ROLE_LEVELS = {
  [UserRole.USER]: 1,
  [UserRole.ADMIN]: 9,
} as const;

/**
 * 최소 권한 레벨 미들웨어를 반환하는 함수
 */
function requireRoleLevel(minLevel: number) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const userLevel = ROLE_LEVELS[req.user.role];
    if (userLevel < minLevel) {
      throw new ForbiddenError();
    }

    next();
  };
}

/**
 * 관리자 권한 요구 미들웨어
 */
export function requireAdmin() {
  return requireRoleLevel(ROLE_LEVELS[UserRole.ADMIN]);
}

/**
 * 로그인 요구 미들웨어 (일반 사용자)
 */
export function requireUser() {
  return requireRoleLevel(ROLE_LEVELS[UserRole.USER]);
}

/**
 * 소유권 요구 미들웨어 (본인 + 관리자)
 */
export function requireOwnership(paramName: string = "userId") {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new UnauthorizedError();

    const resourceUserId = Number(req.params[paramName]);
    const currentUserId = req.user.id;

    // 자신의 리소스이거나 관리자인 경우 허용
    if (resourceUserId === currentUserId || req.user.role === UserRole.ADMIN) {
      next();
    } else {
      throw new ForbiddenError();
    }
  };
}
