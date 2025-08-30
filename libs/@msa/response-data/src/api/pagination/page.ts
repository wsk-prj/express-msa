export interface Page<T> {
  content: T[];

  size: number;
  number: number;
  totalPages: number;
  numberOfElements: number;
  totalElements: number;

  isFirst: boolean;
  isLast: boolean;
}

export interface PagedRequest {
  pageSize?: number;
  pageNumber?: number;
  sortBy?: string;
  direction?: "asc" | "desc";
}
