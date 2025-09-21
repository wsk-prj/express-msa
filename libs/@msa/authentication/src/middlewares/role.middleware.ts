import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "@msa/http-error";
import { UserRole } from "../types/auth-user";

/**
 * 관리자 권한 요구 미들웨어
 */
export function checkIsAdmin() {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new UnauthorizedError();
    if (req.user.role !== UserRole.ADMIN) throw new ForbiddenError("Access denied");

    next();
  };
}

/**
 * 소유권 요구 미들웨어 (본인 + 관리자)
 */
export function checkHasOwnership() {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw new UnauthorizedError();

    const resourceUserId = Number(req.params.userId);
    const currentUser = req.user;

    // 1. 자신의 리소스인 경우 허용
    if (currentUser.id === resourceUserId) next();

    // 2. 관리자인 경우 허용
    if (currentUser.role === UserRole.ADMIN) next();

    throw new ForbiddenError("Access denied");
  };
}
