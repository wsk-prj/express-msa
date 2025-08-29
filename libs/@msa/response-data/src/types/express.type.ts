import "express";

import { ApiData } from "../api/api-data";
import { HttpError } from "@msa/http-error";

declare module "express-serve-static-core" {
  interface Response {
    success: <T>(data?: any, status?: number, message?: string, details?: any) => Response<ApiData<T>>;
    created: <T>(data?: any) => Response<ApiData<T>>;
    noContent: () => Response<void>;
    fail: (error?: HttpError) => Response<ApiData>;
    error: (error?: HttpError) => Response<ApiData>;
  }
}
