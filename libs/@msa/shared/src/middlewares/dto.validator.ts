import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";

import { BadRequestError } from "@msa/http-error";

/**
 * Zod 스키마를 사용한 요청 검증 미들웨어
 */
export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Zod 스키마 검증
      const validatedData = schema.parse(req.body);
      req.body = validatedData;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const firstError = error.errors[0];
        const errorMessage = firstError?.message || "Request validation failed";

        throw new BadRequestError(errorMessage);
      }

      throw new BadRequestError("Invalid request data");
    }
  };
}
