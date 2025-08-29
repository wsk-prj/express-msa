export interface ApiData<T = null> {
  status: number;
  message?: string;
  details?: any;
  data?: T;
}
