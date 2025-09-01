interface SearchConditionOptions {
  mode?: "insensitive" | "sensitive";
  type?: "contains" | "startsWith" | "endsWith" | "equals";
}

/**
 * Prisma 검색 조건을 생성하는 유틸리티 함수
 * @param field 검색할 필드명
 * @param value 검색어
 * @param options 검색 옵션
 */
export function createSearchCondition(
  field: string,
  value: string,
  options: SearchConditionOptions = {
    mode: "insensitive",
    type: "contains",
  }
) {
  const { mode, type } = options;

  if (!value) return {};

  const condition: any = { mode };
  switch (type) {
    case "contains":
      condition.contains = value;
      break;
    case "startsWith":
      condition.startsWith = value;
      break;
    case "endsWith":
      condition.endsWith = value;
      break;
    case "equals":
      condition.equals = value;
      break;
    default:
      condition.contains = value;
  }

  return { [field]: condition };
}

/**
 * 여러 필드에 대한 OR 검색 조건 생성
 * @param fields 검색할 필드들
 * @param value 검색어
 * @param options 검색 옵션
 */
export function createMultiFieldSearchCondition(
  fields: string[],
  value: string,
  options: SearchConditionOptions = {
    mode: "insensitive",
    type: "contains",
  }
) {
  if (!value || fields.length === 0) return {};

  const conditions = fields.map((field) => createSearchCondition(field, value, options));

  return { OR: conditions };
}

/**
 * 날짜 범위 검색 조건 생성
 * @param from 시작 날짜 (ISO 문자열)
 * @param to 종료 날짜 (ISO 문자열)
 * @param dateField 날짜 필드명
 */
export function createDateRangeCondition(from?: string, to?: string, dateField: string = "createdAt") {
  const condition: any = {};

  if (from) {
    condition.gte = new Date(from);
  }

  if (to) {
    condition.lte = new Date(to);
  }

  if (Object.keys(condition).length === 0) return {};

  return { [dateField]: condition };
}
