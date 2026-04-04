import { AppDataSource } from "../config/data-source";
import { Category } from "../entities/category.entity";

export class CategoryRepository {
  private readonly categoryRepository = AppDataSource.getRepository(Category);

  async count(): Promise<number> {
    return this.categoryRepository.count();
  }

  async findMany(options: {
    order: Record<string, "ASC" | "DESC">;
    take: number;
    skip: number;
  }): Promise<Category[]> {
    return this.categoryRepository.find({
      order: options.order,
      take: options.take,
      skip: options.skip,
    });
  }

  async saveNew(name: string): Promise<Category> {
    const entity = this.categoryRepository.create({ name });
    return this.categoryRepository.save(entity);
  }

  /**
   * Case-insensitive match on stored names (rows are trimmed at rest per DB CHECK).
   */
  async existsByNameCaseInsensitive(name: string): Promise<boolean> {
    const count = await this.categoryRepository
      .createQueryBuilder("c")
      .where("LOWER(c.name) = LOWER(:name)", { name })
      .getCount();
    return count > 0;
  }

  async getById(id: number): Promise<Category | null> {
    return this.categoryRepository.findOneBy({ id });
  }
}
