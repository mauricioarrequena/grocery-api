import { CategoryRepository } from "../repositories/category.repository";
import { NotFoundError } from "../errors/not-found.error";
import { validateCreateCategoryBody } from "../validation/create-category.validation";
import { parseListCategoriesQuery } from "../validation/list-categories-query.validation";
import { ApiError } from "../errors/api.error";
import { isPgUniqueViolation } from "../utils/is-pg-unique-violation";
import { toCategoryResponse } from "../utils/category.mapper";
import type {
  CategoryResponseDto,
  ListCategoriesResponseDto,
} from "../types/category.dto";
import type { Request } from "express";

export class CategoryService {
  private categoryRepository = new CategoryRepository();

  async listCategories(
    query: Request["query"],
  ): Promise<ListCategoriesResponseDto> {
    const parsed = parseListCategoriesQuery(query);
    const total = await this.categoryRepository.count();
    const rows = await this.categoryRepository.findMany({
      order: parsed.order,
      take: parsed.limit,
      skip: parsed.offset,
    });

    return {
      data: rows.map(toCategoryResponse),
      meta: {
        total,
        limit: parsed.limit,
        offset: parsed.offset,
      },
    };
  }

  async createCategory(body: unknown): Promise<CategoryResponseDto> {
    const { name } = validateCreateCategoryBody(body);

    if (await this.categoryRepository.existsByNameCaseInsensitive(name)) {
      throw new ApiError(
        409,
        "CATEGORY_NAME_CONFLICT",
        "A category with this name already exists",
        [
          {
            field: "name",
            message: "name must be unique (case-insensitive)",
            code: "UNIQUE_VIOLATION",
          },
        ],
      );
    }

    try {
      const saved = await this.categoryRepository.saveNew(name);
      return toCategoryResponse(saved);
    } catch (error) {
      if (isPgUniqueViolation(error)) {
        throw new ApiError(
          409,
          "CATEGORY_NAME_CONFLICT",
          "A category with this name already exists",
          [
            {
              field: "name",
              message: "name must be unique",
              code: "UNIQUE_VIOLATION",
            },
          ],
        );
      }
      throw error;
    }
  }

  async getCategoryById(id: number) {
    const category = await this.categoryRepository.getById(id);
    if (!category) {
      throw new NotFoundError("Category not found");
    }

    return toCategoryResponse(category);
  }
}
