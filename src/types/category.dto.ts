export interface CreateCategoryDto {
  name: string;
}

export interface CategoryResponseDto {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListCategoriesMetaDto {
  total: number;
  limit: number;
  offset: number;
}

export interface ListCategoriesResponseDto {
  data: CategoryResponseDto[];
  meta: ListCategoriesMetaDto;
}

export interface CreateCategoryResponseDto {
  data: CategoryResponseDto;
}
