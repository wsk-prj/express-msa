import { JWTPayload } from "@/libs/jwt";

// Express Request 타입 확장
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}
