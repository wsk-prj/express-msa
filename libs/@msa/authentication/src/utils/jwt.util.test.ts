import {
  setup,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  extractAuthUserFromToken,
  updateRefreshToken,
} from "./jwt.util";
import { JwtConfig } from "./jwt.util";
import { AccessPayload, RefreshPayload } from "../types/jwt";

describe("JWT Utils", () => {
  const mockConfig: JwtConfig = {
    JWT_SECRET: "test-secret-key",
    JWT_EXPIRES_IN: 900, // 15분 (초 단위)
    JWT_REFRESH_SECRET: "test-refresh-secret-key",
    JWT_REFRESH_EXPIRES_IN: 7200, // 2시간 (초 단위)
    JWT_REFRESH_REGENERATE_THRESHOLD: 1800, // 30분 (초 단위)
  };

  const mockAccessPayload = {
    sub: 123,
    email: "test@example.com",
    nickname: "testuser",
  } as AccessPayload;

  const mockRefreshPayload = {
    sub: 123,
    tokenVersion: 1,
  } as RefreshPayload;

  beforeEach(() => {
    setup(mockConfig);
  });

  describe("setup", () => {
    it("설정을 올바르게 초기화해야 한다", () => {
      expect(() => setup(mockConfig)).not.toThrow();
    });
  });

  describe("generateAccessToken", () => {
    it("유효한 페이로드로 액세스 토큰을 생성해야 한다", () => {
      const token = generateAccessToken(mockAccessPayload);
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3); // JWT string은 3개 부분으로 구성
    });

    it("설정이 초기화되지 않으면 에러를 던져야 한다", () => {
      // 새로운 모듈 인스턴스를 생성하여 초기화되지 않은 상태 시뮬레이션
      jest.resetModules();
      const { generateAccessToken: newGenerateAccessToken } = require("./jwt.util");
      
      expect(() => newGenerateAccessToken(mockAccessPayload)).toThrow("JwtUtil is not initialized");
      
      // 모듈을 다시 로드하여 원래 상태로 복원
      jest.resetModules();
    });
  });

  describe("generateRefreshToken", () => {
    it("유효한 페이로드로 리프레시 토큰을 생성해야 한다", () => {
      const token = generateRefreshToken(mockRefreshPayload);
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);
    });
  });

  describe("verifyAccessToken", () => {
    it("유효한 액세스 토큰을 검증해야 한다", () => {
      const token = generateAccessToken(mockAccessPayload);
      const payload = verifyAccessToken(token);
      
      expect(payload.sub).toBe(mockAccessPayload.sub);
      expect(payload.email).toBe(mockAccessPayload.email);
      expect(payload.nickname).toBe(mockAccessPayload.nickname);
    });

    it("잘못된 토큰에 대해 에러를 던져야 한다", () => {
      expect(() => verifyAccessToken("invalid-token")).toThrow("Invalid access token");
    });

    it("잘못된 시크릿으로 서명된 토큰에 대해 에러를 던져야 한다", () => {
      // 잘못된 시크릿으로 토큰 생성
      const wrongConfig = { ...mockConfig, JWT_SECRET: "wrong-secret" };
      setup(wrongConfig);
      const token = generateAccessToken(mockAccessPayload);
      
      // 올바른 설정으로 복원
      setup(mockConfig);
      
      // 이제 토큰 검증 시 에러가 발생해야 함
      expect(() => verifyAccessToken(token)).toThrow("Invalid access token");
    });
  });

  describe("verifyRefreshToken", () => {
    it("유효한 리프레시 토큰을 검증해야 한다", () => {
      const token = generateRefreshToken(mockRefreshPayload);
      const payload = verifyRefreshToken(token);
      
      expect(payload.sub).toBe(mockRefreshPayload.sub);
    });

    it("잘못된 리프레시 토큰에 대해 에러를 던져야 한다", () => {
      expect(() => verifyRefreshToken("invalid-token")).toThrow("Invalid refresh token");
    });
  });

  describe("extractAuthUserFromToken", () => {
    it("토큰에서 사용자 정보를 올바르게 추출해야 한다", () => {
      const token = generateAccessToken(mockAccessPayload);
      const user = extractAuthUserFromToken(token);
      
      expect(user.id).toBe(mockAccessPayload.sub);
      expect(user.email).toBe(mockAccessPayload.email);
      expect(user.nickname).toBe(mockAccessPayload.nickname);
    });

    it("잘못된 토큰에 대해 에러를 던져야 한다", () => {
      expect(() => extractAuthUserFromToken("invalid-token")).toThrow("Invalid token");
    });
  });

  describe("updateRefreshToken", () => {
    it("토큰이 아직 유효하면 기존 토큰을 반환해야 한다", () => {
      const token = generateRefreshToken(mockRefreshPayload);
      const updatedToken = updateRefreshToken(token, mockRefreshPayload);
      
      expect(updatedToken).toBe(token);
    });

    it("토큰이 곧 만료되면 새로운 토큰을 생성해야 한다", () => {
      // 짧은 만료 시간으로 토큰 생성
      const shortExpiryConfig = {
        ...mockConfig,
        JWT_REFRESH_EXPIRES_IN: 1, // 1초
      };
      setup(shortExpiryConfig);
      const token = generateRefreshToken(mockRefreshPayload);
      
      // 임계값을 매우 크게 설정하여 토큰이 만료되었다고 판단하도록 함
      const shortThresholdConfig = {
        ...mockConfig,
        JWT_REFRESH_REGENERATE_THRESHOLD: 86400, // 1일 (초 단위)
      };
      setup(shortThresholdConfig);
      
      const updatedToken = updateRefreshToken(token, mockRefreshPayload);
      
      expect(updatedToken).not.toBe(token);
      expect(updatedToken).toBeDefined();
    });
  });

  describe("토큰 만료 시간 처리", () => {
    it("JWT exp 필드가 초 단위로 올바르게 처리되어야 한다", () => {
      const token = generateAccessToken(mockAccessPayload);
      const payload = verifyAccessToken(token);
      
      // exp는 초 단위여야 함
      expect(payload.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
      expect(payload.exp).toBeLessThan(Math.floor(Date.now() / 1000) + 1000); // 15분 + 여유분
    });
  });
});
