import { CategoryRepository } from "../repositories/category.repository";
import { NotFoundError } from "../errors/not-found.error";


export class CategoryService {
  private categoryRepository = new CategoryRepository();

  async getCategories() {
    return await this.categoryRepository.getAll();
  }

  async getCategoryById(id: number) {
    const category = await this.categoryRepository.getById(id);
    if (!category) {
      throw new NotFoundError("Category not found");
    }

    return category;
  }
}
