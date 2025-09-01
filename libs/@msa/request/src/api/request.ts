export interface PagedParams {
  pageSize?: number;
  pageNumber?: number;
  sortBy?: string;
  direction?: "asc" | "desc";
}

export interface SearchParams {
  q?: string;
  fields?: string[];
  type?: "contains" | "startsWith" | "endsWith" | "equals";
  filters?: Record<string, any>;
  dateFrom?: string;
  dateTo?: string;
}

export interface QueryParams extends PagedParams, SearchParams {}
