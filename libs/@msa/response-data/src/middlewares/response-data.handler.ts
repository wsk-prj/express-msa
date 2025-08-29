import { Request, Response, NextFunction } from "express";

import { ApiData } from "../api/api-data";
import { HttpError } from "@msa/http-error";

export const responseDataHandler = (_req: Request, res: Response, next: NextFunction) => {
  res.success = <T>(data?: any, status: number = 200, message: string = "Success", details?: any): Response<ApiData<T>> => {
    return res.status(status).json({
      success: true,
      status: status,
      message: message,
      details: details,
      data,
    });
  };
  res.created = <T>(data?: any): Response<ApiData<T>> => {
    return res.success(data, 201);
  };
  res.noContent = (): Response<void> => {
    return res.status(204).json();
  };
  res.fail = (error?: HttpError): Response<ApiData> => {
    return res.status(error?.status ?? 400).json({
      success: false,
      status: error?.status ?? 400,
      message: error?.message ?? "Failed",
      details: error?.details,
    });
  };
  res.error = (error?: HttpError): Response<ApiData> => {
    return res.status(error?.status ?? 500).json({
      success: false,
      status: error?.status ?? 500,
      message: error?.message ?? "Error",
      details: error?.details,
    });
  };
  next();
};
