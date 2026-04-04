import { Category } from "../entities/category.entity";
import type { CategoryResponseDto } from "../types/category.dto";

export function toCategoryResponse(category: Category): CategoryResponseDto {
  return {
    id: category.id,
    name: category.name,
    createdAt: category.createdAt.toISOString(),
    updatedAt: category.updatedAt.toISOString(),
  };
}
