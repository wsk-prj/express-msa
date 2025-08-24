import rateLimit from "express-rate-limit";

/**
 * 일반 API 요청용 Rate Limiting
 */
export const generalRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1분
  max: 100, // 100회 요청
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
    status: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 로그인 시도용 Rate Limiting
 */
export const loginRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1분
  max: 5, // 5회 로그인 시도
  message: {
    success: false,
    message: "Too many login attempts, please try again later.",
    status: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 회원가입 시도용 Rate Limiting
 */
export const signupRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 1분
  max: 5, // 5회 회원가입 시도
  message: {
    success: false,
    message: "Too many signup attempts, please try again later.",
    status: 429,
  },
  standardHeaders: true,
  legacyHeaders: false,
});
