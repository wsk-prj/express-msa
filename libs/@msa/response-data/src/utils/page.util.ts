import { Page, PagedRequest } from "../api/pagination/page";

export function createPage<T>(items: T[], { pageNumber = 0, pageSize = 10 }: PagedRequest): Page<T> {
  // Calculate pagination
  const totalElements = items.length;
  const totalPages = Math.ceil(totalElements / pageSize);
  const startIndex = pageNumber * pageSize;
  const endIndex = startIndex + pageSize;

  // Get current page data
  const content = items.slice(startIndex, endIndex);
  const numberOfElements = content.length;

  // Return Page<T> object
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
