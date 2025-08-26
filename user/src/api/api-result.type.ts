export type ApiResult<T = any> = {
  timestamp: string;
  success: boolean;
  status: number;
  message: string;
  data?: T;
  details?: string;
  path: string;
};
