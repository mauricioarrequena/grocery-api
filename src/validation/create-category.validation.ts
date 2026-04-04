import { ApiError } from "../errors/api.error";

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 50;

export function validateCreateCategoryBody(body: unknown): { name: string } {
  if (body === null || typeof body !== "object" || Array.isArray(body)) {
    throw new ApiError(400, "VALIDATION_ERROR", "Request validation failed", [
      {
        field: "body",
        message: "must be a JSON object",
        code: "INVALID_BODY",
      },
    ]);
  }

  const record = body as Record<string, unknown>;

  if (!Object.prototype.hasOwnProperty.call(record, "name")) {
    throw new ApiError(400, "VALIDATION_ERROR", "Request validation failed", [
      { field: "name", message: "must be present", code: "REQUIRED" },
    ]);
  }

  const name = record.name;
  if (typeof name !== "string") {
    throw new ApiError(400, "VALIDATION_ERROR", "Request validation failed", [
      { field: "name", message: "must be a string", code: "INVALID_TYPE" },
    ]);
  }

  const trimmed = name.trim();
  if (trimmed.length < MIN_NAME_LENGTH) {
    throw new ApiError(400, "VALIDATION_ERROR", "Request validation failed", [
      {
        field: "name",
        message: `must be at least ${MIN_NAME_LENGTH} characters`,
        code: "MIN_LENGTH",
      },
    ]);
  }

  if (trimmed.length > MAX_NAME_LENGTH) {
    throw new ApiError(400, "VALIDATION_ERROR", "Request validation failed", [
      {
        field: "name",
        message: `must be at most ${MAX_NAME_LENGTH} characters`,
        code: "MAX_LENGTH",
      },
    ]);
  }

  if (trimmed !== name) {
    throw new ApiError(400, "VALIDATION_ERROR", "Request validation failed", [
      {
        field: "name",
        message: "must not have leading or trailing spaces",
        code: "TRIM_REQUIRED",
      },
    ]);
  }

  return { name: trimmed };
}
