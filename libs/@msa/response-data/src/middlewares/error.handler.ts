import { NextFunction, Request, Response } from "express";

import { BadRequestError, InternalServerError } from "@msa/http-error";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.log(err);
  if (err instanceof BadRequestError) return res.fail(err);
  if (err instanceof InternalServerError) return res.error(err);

  return res.error(new InternalServerError("Unknown Error"));
};
