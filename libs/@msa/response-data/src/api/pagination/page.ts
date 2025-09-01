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

export interface PagedParams {
  pageSize?: number;
  pageNumber?: number;
  sortBy?: string;
  direction?: "asc" | "desc";
}

export interface SearchParams {
  q?: string;
  fields?: string[];
  filters?: Record<string, any>;

  dateFrom?: string;
  dateTo?: string;
}

export interface QueryParams extends PagedParams, SearchParams {}
