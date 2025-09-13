import { Request } from "express";

/**
 * 요청에서 JWT 토큰을 추출합니다.
 * Authorization 헤더에서 Bearer 토큰을 추출합니다.
 */
export function extractToken(req: Request): string | null {
  return extractTokenFromHeader(req.headers.authorization);
}

/**
 * Authorization 헤더에서 토큰 추출
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * 쿠키에서 JWT 토큰을 추출합니다.
 */
export function extractTokenFromCookie(req: Request, cookieName: string = 'token'): string | null {
  return req.cookies?.[cookieName] || null;
}
