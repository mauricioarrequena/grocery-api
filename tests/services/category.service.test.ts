import { CategoryService } from "../../src/services/category.service";
import { CategoryRepository } from "../../src/repositories/category.repository";
import { NotFoundError } from "../../src/errors/not-found.error";

jest.mock("../../src/repositories/category.repository");

describe("CategoryService", () => {
  it("should return categories from the repository", async () => {
    const mockCategories = [
      { id: 1, name: "Fruits" },
      { id: 2, name: "Vegetables" },
    ];
    const mockedRepository = {
      getAll: jest.fn().mockResolvedValue(mockCategories),
    };
    (CategoryRepository as jest.Mock).mockImplementation(
      () => mockedRepository,
    );
    const categoryService = new CategoryService();

    const result = await categoryService.getCategories();

    expect(mockedRepository.getAll).toHaveBeenCalled();
    expect(result).toEqual(mockCategories);
  });

  it("should return a category when the id exists", async () => {
    const mockCategory = { id: 1, name: "Fruits" };
    const mockedRepository = {
      getById: jest.fn().mockResolvedValue(mockCategory),
    };
    (CategoryRepository as jest.Mock).mockImplementation(
      () => mockedRepository,
    );
    const categoryService = new CategoryService();

    const result = await categoryService.getCategoryById(1);

    expect(mockedRepository.getById).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockCategory);
  });

  it("should throw NotFoundError when the category does not exist", async () => {
    const mockedRepository = {
      getById: jest.fn().mockResolvedValue(null),
    };
    (CategoryRepository as jest.Mock).mockImplementation(
      () => mockedRepository,
    );
    const categoryService = new CategoryService();

    await expect(categoryService.getCategoryById(999)).rejects.toBeInstanceOf(
      NotFoundError,
    );

    expect(mockedRepository.getById).toHaveBeenCalledWith(999);
  });
});
