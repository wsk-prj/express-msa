import jwt, { SignOptions } from "jsonwebtoken";

import { config } from "@/config";

export interface JWTPayload {
  userId: number;
  email: string;
  nickname: string;
}

export interface RefreshTokenPayload {
  userId: number;
  tokenVersion: number;
}

/**
 * Access Token 생성
 */
export const generateAccessToken = (payload: JWTPayload): string => {
  try {
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_ACCESS_EXPIRES_IN,
    } as SignOptions);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate access token");
  }
};

/**
 * Refresh Token 생성
 */
export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  try {
    return jwt.sign(payload, config.JWT_SECRET_REFRESH, {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN,
    } as SignOptions);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate refresh token");
  }
};

/**
 * Access Token 검증
 */
export const verifyAccessToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, config.JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error("Invalid access token");
  }
};

/**
 * Refresh Token 검증
 */
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    return jwt.verify(token, config.JWT_SECRET_REFRESH) as RefreshTokenPayload;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};

/**
 * 토큰의 만료 시간을 확인 (밀리초 단위)
 */
export const getTokenExpirationTime = (token: string): number => {
  try {
    const decoded = jwt.decode(token) as any;
    return decoded?.exp ? decoded.exp * 1000 : 0;
  } catch (error) {
    return 0;
  }
};

/**
 * 토큰이 곧 만료되는지 확인
 */
export const isTokenExpiringSoon = (token: string, thresholdMinutes: number = 30): boolean => {
  const expirationTime = getTokenExpirationTime(token);
  if (expirationTime === 0) return false;

  const now = Date.now();
  const thresholdMs = thresholdMinutes * 60 * 1000;

  return expirationTime - now <= thresholdMs;
};

/**
 * 리프레시 토큰 갱신
 */
export const regenRefreshToken = (
  refreshToken: string,
  user: { id: number; tokenVersion: number },
  thresholdMinutes: number = 30
): string => {
  if (isTokenExpiringSoon(refreshToken, thresholdMinutes)) {
    return generateRefreshToken({
      userId: user.id,
      tokenVersion: user.tokenVersion,
    });
  }
  // 만료 안되면 기존 토큰 그대로 반환
  return refreshToken;
};

/**
 * Authorization 헤더에서 토큰 추출
 */
export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
};
