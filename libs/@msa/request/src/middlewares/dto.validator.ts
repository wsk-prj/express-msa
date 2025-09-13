import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";

import { BadRequestError, ValidationError, ValidationFieldError } from "@msa/http-error";

/**
 * Zod 스키마를 사용한 요청 검증 미들웨어
 */
export function validateRequest(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: ValidationFieldError[] = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          value: undefined
        }));

        throw new ValidationError(fieldErrors);
      }

      throw new BadRequestError("Invalid request data");
    }
  };
}

/**
 * Zod 스키마를 사용한 쿼리 파라미터 검증 미들웨어
 */
export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.query);
      req.query = validatedData;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: ValidationFieldError[] = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          value: undefined
        }));

        throw new ValidationError(fieldErrors);
      }

      throw new BadRequestError("Invalid query parameters");
    }
  };
}
