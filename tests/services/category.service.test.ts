import { QueryFailedError } from "typeorm";
import { CategoryService } from "../../src/services/category.service";
import { CategoryRepository } from "../../src/repositories/category.repository";
import { NotFoundError } from "../../src/errors/not-found.error";
import { ApiError } from "../../src/errors/api.error";

jest.mock("../../src/repositories/category.repository");

describe("CategoryService", () => {
  const createdAt = new Date("2026-04-01T10:00:00.000Z");
  const updatedAt = new Date("2026-04-01T10:00:00.000Z");

  it("should list categories with meta", async () => {
    const mockRows = [
      { id: 1, name: "Fruits", createdAt, updatedAt },
      { id: 2, name: "Vegetables", createdAt, updatedAt },
    ];
    const mockedRepository = {
      count: jest.fn().mockResolvedValue(2),
      findMany: jest.fn().mockResolvedValue(mockRows),
    };
    (CategoryRepository as jest.Mock).mockImplementation(() => mockedRepository);
    const categoryService = new CategoryService();

    const result = await categoryService.listCategories({});

    expect(mockedRepository.count).toHaveBeenCalled();
    expect(mockedRepository.findMany).toHaveBeenCalledWith({
      order: { name: "ASC" },
      take: 50,
      skip: 0,
    });
    expect(result.data).toHaveLength(2);
    expect(result.meta).toEqual({ total: 2, limit: 50, offset: 0 });
    expect(result.data[0].name).toBe("Fruits");
    expect(result.data[0].createdAt).toBe(createdAt.toISOString());
  });

  it("should create a category and return a response DTO", async () => {
    const saved = { id: 3, name: "Pantry", createdAt, updatedAt };
    const mockedRepository = {
      existsByNameCaseInsensitive: jest.fn().mockResolvedValue(false),
      saveNew: jest.fn().mockResolvedValue(saved),
    };
    (CategoryRepository as jest.Mock).mockImplementation(() => mockedRepository);
    const categoryService = new CategoryService();

    const result = await categoryService.createCategory({ name: "Pantry" });

    expect(mockedRepository.existsByNameCaseInsensitive).toHaveBeenCalledWith(
      "Pantry",
    );
    expect(mockedRepository.saveNew).toHaveBeenCalledWith("Pantry");
    expect(result).toEqual({
      id: 3,
      name: "Pantry",
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    });
  });

  it("should throw ApiError on unique name violation from database", async () => {
    const dup = new QueryFailedError("INSERT", [], {
      code: "23505",
    } as never);
    const mockedRepository = {
      existsByNameCaseInsensitive: jest.fn().mockResolvedValue(false),
      saveNew: jest.fn().mockRejectedValue(dup),
    };
    (CategoryRepository as jest.Mock).mockImplementation(() => mockedRepository);
    const categoryService = new CategoryService();

    await expect(
      categoryService.createCategory({ name: "Dairy" }),
    ).rejects.toMatchObject({
      status: 409,
      code: "CATEGORY_NAME_CONFLICT",
    });
  });

  it("should throw ApiError when name exists case-insensitively", async () => {
    const mockedRepository = {
      existsByNameCaseInsensitive: jest.fn().mockResolvedValue(true),
      saveNew: jest.fn(),
    };
    (CategoryRepository as jest.Mock).mockImplementation(() => mockedRepository);
    const categoryService = new CategoryService();

    await expect(
      categoryService.createCategory({ name: "dairy" }),
    ).rejects.toMatchObject({
      status: 409,
      code: "CATEGORY_NAME_CONFLICT",
    });
    expect(mockedRepository.saveNew).not.toHaveBeenCalled();
  });

  it("should throw ApiError when create body is invalid", async () => {
    const mockedRepository = { saveNew: jest.fn() };
    (CategoryRepository as jest.Mock).mockImplementation(() => mockedRepository);
    const categoryService = new CategoryService();

    await expect(categoryService.createCategory({})).rejects.toBeInstanceOf(
      ApiError,
    );
    expect(mockedRepository.saveNew).not.toHaveBeenCalled();
  });

  it("should return a category when the id exists", async () => {
    const mockCategory = { id: 1, name: "Fruits", createdAt, updatedAt };
    const mockedRepository = {
      getById: jest.fn().mockResolvedValue(mockCategory),
    };
    (CategoryRepository as jest.Mock).mockImplementation(() => mockedRepository);
    const categoryService = new CategoryService();

    const result = await categoryService.getCategoryById(1);

    expect(mockedRepository.getById).toHaveBeenCalledWith(1);
    expect(result).toEqual({
      id: 1,
      name: "Fruits",
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
    });
  });

  it("should throw NotFoundError when the category does not exist", async () => {
    const mockedRepository = {
      getById: jest.fn().mockResolvedValue(null),
    };
    (CategoryRepository as jest.Mock).mockImplementation(() => mockedRepository);
    const categoryService = new CategoryService();

    await expect(categoryService.getCategoryById(999)).rejects.toBeInstanceOf(
      NotFoundError,
    );

    expect(mockedRepository.getById).toHaveBeenCalledWith(999);
  });
});
