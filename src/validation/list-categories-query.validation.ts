import { Request } from "express";
import { ApiError } from "../errors/api.error";

const ALLOWED_SORT = new Set([
  "name",
  "-name",
  "createdAt",
  "-createdAt",
]);

const DEFAULT_LIMIT = 50;
const MIN_LIMIT = 1;
const MAX_LIMIT = 100;

export type ListCategoriesSortKey = "name" | "-name" | "createdAt" | "-createdAt";

export interface ParsedListCategoriesQuery {
  sort: ListCategoriesSortKey;
  limit: number;
  offset: number;
  order: Record<string, "ASC" | "DESC">;
}

function parseNonNegativeInt(
  value: unknown,
  field: string,
  defaultValue: number,
): number {
  if (value === undefined || value === "") {
    return defaultValue;
  }
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Request validation failed", [
      {
        field,
        message: "must be a non-negative integer",
        code: "INVALID_INTEGER",
      },
    ]);
  }
  return n;
}

function parseLimit(value: unknown): number {
  if (value === undefined || value === "") {
    return DEFAULT_LIMIT;
  }
  const n = Number(value);
  if (!Number.isInteger(n)) {
    throw new ApiError(400, "VALIDATION_ERROR", "Request validation failed", [
      {
        field: "limit",
        message: "must be an integer",
        code: "INVALID_INTEGER",
      },
    ]);
  }
  if (n < MIN_LIMIT || n > MAX_LIMIT) {
    throw new ApiError(400, "VALIDATION_ERROR", "Request validation failed", [
      {
        field: "limit",
        message: `must be between ${MIN_LIMIT} and ${MAX_LIMIT}`,
        code: "OUT_OF_RANGE",
      },
    ]);
  }
  return n;
}

function sortToOrder(sort: ListCategoriesSortKey): Record<string, "ASC" | "DESC"> {
  switch (sort) {
    case "name":
      return { name: "ASC" };
    case "-name":
      return { name: "DESC" };
    case "createdAt":
      return { createdAt: "ASC" };
    case "-createdAt":
      return { createdAt: "DESC" };
    default:
      return { name: "ASC" };
  }
}

export function parseListCategoriesQuery(
  query: Request["query"],
): ParsedListCategoriesQuery {
  const sortRaw = query.sort;
  let sort: ListCategoriesSortKey = "name";

  if (typeof sortRaw === "string") {
    if (!ALLOWED_SORT.has(sortRaw)) {
      throw new ApiError(400, "VALIDATION_ERROR", "Request validation failed", [
        {
          field: "sort",
          message: "invalid value",
          code: "INVALID_SORT",
        },
      ]);
    }
    sort = sortRaw as ListCategoriesSortKey;
  } else if (sortRaw !== undefined) {
    throw new ApiError(400, "VALIDATION_ERROR", "Request validation failed", [
      {
        field: "sort",
        message: "must be a string",
        code: "INVALID_TYPE",
      },
    ]);
  }

  const limit = parseLimit(query.limit);
  const offset = parseNonNegativeInt(query.offset, "offset", 0);

  return {
    sort,
    limit,
    offset,
    order: sortToOrder(sort),
  };
}
