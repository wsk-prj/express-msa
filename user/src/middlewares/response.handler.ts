import { NextFunction, Request, Response } from "express";

import { HttpError } from "@/api/error/http-error";
import { ApiResult } from "@/api/api-result.type";

export const responseHandler = (_req: Request, res: Response, next: NextFunction) => {
  res.success = <T>(data?: any, status: number = 200, message: string = "Success", details?: any): Response<ApiResult<T>> => {
    return res.status(status).json({
      timestamp: new Date().toISOString(),
      success: true,
      status: status,
      message: message,
      details: details,
      path: _req.originalUrl,
      data,
    });
  };
  res.created = <T>(data?: any): Response<ApiResult<T>> => {
    return res.success(data, 201);
  };
  res.noContent = (): Response<void> => {
    return res.status(204).json();
  };
  res.fail = (error?: HttpError): Response<ApiResult> => {
    return res.status(error?.status ?? 400).json({
      timestamp: new Date().toISOString(),
      success: false,
      status: error?.status ?? 400,
      message: error?.message ?? "Failed",
      details: error?.details,
      path: _req.originalUrl,
    });
  };
  res.error = (error?: HttpError): Response<ApiResult> => {
    return res.status(error?.status ?? 500).json({
      timestamp: new Date().toISOString(),
      success: false,
      status: error?.status ?? 500,
      message: error?.message ?? "Error",
      details: error?.details,
      path: _req.originalUrl,
    });
  };
  next();
};
