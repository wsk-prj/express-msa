import jwt, { SignOptions } from "jsonwebtoken";
import { JwtPayload, AccessPayload, RefreshPayload } from "../types/jwt";
import { AuthUser } from "../types/auth-user";

export interface JwtConfig {
  JWT_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_ACCESS_REGENERATE_THRESHOLD: string;

  JWT_SECRET_REFRESH: string;
  JWT_REFRESH_EXPIRES_IN: string;
  JWT_REFRESH_REGENERATE_THRESHOLD: string;
}

let jwtConfig: JwtConfig | null = null;

/**
 * JwtUtil 설정 초기화
 */
export function setup(config: JwtConfig): void {
  jwtConfig = config;
}

/**
 * Access Token 생성
 */
export function generateAccessToken(payload: AccessPayload): string {
  validateConfig();

  try {
    const token = jwt.sign(payload, jwtConfig!.JWT_SECRET, {
      expiresIn: jwtConfig!.JWT_ACCESS_EXPIRES_IN,
    } as SignOptions);

    if (process.env.NODE_ENV === "development") {
      const decoded = jwt.verify(token, jwtConfig!.JWT_SECRET) as unknown as JwtPayload;
      console.log(`✅ AT Payload: { sub: ${decoded.sub}, expires: ${new Date(decoded.exp! * 1000).toISOString()}}`);
    }

    return token;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate access token");
  }
}

/**
 * Refresh Token 생성
 */
export function generateRefreshToken(payload: RefreshPayload): string {
  validateConfig();

  try {
    return jwt.sign(payload, jwtConfig!.JWT_SECRET_REFRESH, {
      expiresIn: jwtConfig!.JWT_REFRESH_EXPIRES_IN,
    } as SignOptions);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to generate refresh token");
  }
}

/**
 * Access Token 검증
 */
export function verifyAccessToken(token: string): AccessPayload {
  validateConfig();

  try {
    return jwt.verify(token, jwtConfig!.JWT_SECRET) as unknown as AccessPayload;
  } catch (error) {
    throw new Error("Invalid access token");
  }
}

/**
 * Refresh Token 검증
 */
export function verifyRefreshToken(token: string): RefreshPayload {
  validateConfig();

  try {
    return jwt.verify(token, jwtConfig!.JWT_SECRET_REFRESH) as unknown as RefreshPayload;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
}

/**
 * JWT 토큰을 검증하고 페이로드를 반환
 */
export function extractAuthUserFromToken(token: string): AuthUser {
  try {
    const payload = verifyAccessToken(token);

    return {
      id: payload.sub,
      email: payload.email,
      nickname: payload.nickname,
    };
  } catch (error) {
    throw new Error("Invalid token");
  }
}

/**
 * 리프레시 토큰 업데이트 (필요시 새로 생성)
 */
export function updateRefreshToken(currentRefreshToken: string, payload: RefreshPayload): string {
  // 리프레시 토큰이 곧 만료되면 새로운 토큰 생성
  if (isTokenExpiringSoon(currentRefreshToken, parseInt(jwtConfig!.JWT_REFRESH_REGENERATE_THRESHOLD))) {
    return generateRefreshToken(payload);
  }

  // 아직 유효하면 기존 토큰 그대로 반환
  return currentRefreshToken;
}

/**
 * 토큰이 곧 만료되는지 확인 (밀리초 단위)
 */
function isTokenExpiringSoon(token: string, thresholdMs: number): boolean {
  const expirationTime = getTokenExpirationTime(token);
  if (expirationTime === 0) return false;

  const now = Date.now();
  return expirationTime - now <= thresholdMs;
}

/**
 * 토큰의 만료 시간을 확인 (밀리초 단위)
 */
function getTokenExpirationTime(token: string): number {
  try {
    const decoded = jwt.decode(token) as any;
    return decoded?.exp ? decoded.exp * 1000 : 0;
  } catch (error) {
    return 0;
  }
}

/**
 * 설정이 초기화되었는지 검증
 */
function validateConfig(): void {
  if (!jwtConfig) throw new Error("JwtUtil is not initialized. Call setup() first.");
}
