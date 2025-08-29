export interface ApiResult<T = null> {
  timestamp: string;
  success: boolean;
  status: number;
  message?: string;
  details?: any;
  path?: string;
  data?: T;
}
