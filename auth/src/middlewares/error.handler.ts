import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

import { BadRequestError, ConflictError, UnauthorizedError } from "@/api/error/bad-request";
import { InternalServerError } from "@/api/error/internal-error";
import { config } from "@/config";

const handlers = {
  prisma: (err: Prisma.PrismaClientKnownRequestError, res: Response) => {
    switch (err.code) {
      case "P2002": // 리소스 중복
        return res.fail(new ConflictError("Resource already exists"));
    }
    return res.error(new InternalServerError());
  },
};

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) return handlers.prisma(err, res);
  if (err instanceof UnauthorizedError) res.clearCookie(config.REFRESH_TOKEN_COOKIE_NAME, config.COOKIE_OPTIONS);
  if (err instanceof BadRequestError) return res.fail(err);
  if (err instanceof InternalServerError) return res.error(err);

  return res.error(new InternalServerError("Unknown Error"));
};
