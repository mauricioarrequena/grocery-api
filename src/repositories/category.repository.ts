import { AppDataSource } from "../config/data-source";
import { Category } from "../entities/category.entity";

export class CategoryRepository {
  private readonly categoryRepository = AppDataSource.getRepository(Category);

  async create(category: Category): Promise<Category> {
    return await this.categoryRepository.save(category);
  }

  async getAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async getById(id: number): Promise<Category | null> {
    return await this.categoryRepository.findOneBy({ id });
  }
}
