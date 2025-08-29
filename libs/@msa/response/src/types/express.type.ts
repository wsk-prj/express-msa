import "express";

import { ApiResult } from "../api/api-result";
import { HttpError } from "@msa/http-error";

declare module "express-serve-static-core" {
  interface Response {
    success: <T>(data?: any, status?: number, message?: string, details?: any) => Response<ApiResult<T>>;
    created: <T>(data?: any) => Response<ApiResult<T>>;
    noContent: () => Response<void>;
    fail: (error?: HttpError) => Response<ApiResult>;
    error: (error?: HttpError) => Response<ApiResult>;
  }
}
