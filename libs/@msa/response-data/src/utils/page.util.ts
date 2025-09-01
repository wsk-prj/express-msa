import { Page } from "../api/pagination/page";

interface CreatePageParams<T> {
  items: T[];
  total?: number;
  pageNumber?: number;
  pageSize?: number;
}

export function createPage<T>({
  items,
  total = items.length,
  pageNumber = 0,
  pageSize = 10,
}: CreatePageParams<T>): Page<T> {
  const totalElements = total;
  const totalPages = Math.ceil(totalElements / pageSize);

  const content = pageSize < items.length ? items.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize) : items;
  const numberOfElements = content.length;

  return {
    content,
    size: pageSize,
    number: pageNumber,
    totalPages,
    numberOfElements,
    totalElements,
    isFirst: pageNumber === 0,
    isLast: pageNumber >= totalPages - 1,
  };
}
