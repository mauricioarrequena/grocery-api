"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const category_service_1 = require("../../src/services/category.service");
const category_repository_1 = require("../../src/repositories/category.repository");
const not_found_error_1 = require("../../src/errors/not-found.error");
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
        category_repository_1.CategoryRepository.mockImplementation(() => mockedRepository);
        const categoryService = new category_service_1.CategoryService();
        const result = await categoryService.getCategories();
        expect(mockedRepository.getAll).toHaveBeenCalled();
        expect(result).toEqual(mockCategories);
    });
    it("should return a category when the id exists", async () => {
        const mockCategory = { id: 1, name: "Fruits" };
        const mockedRepository = {
            getById: jest.fn().mockResolvedValue(mockCategory),
        };
        category_repository_1.CategoryRepository.mockImplementation(() => mockedRepository);
        const categoryService = new category_service_1.CategoryService();
        const result = await categoryService.getCategoryById(1);
        expect(mockedRepository.getById).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockCategory);
    });
    it("should throw NotFoundError when the category does not exist", async () => {
        const mockedRepository = {
            getById: jest.fn().mockResolvedValue(null),
        };
        category_repository_1.CategoryRepository.mockImplementation(() => mockedRepository);
        const categoryService = new category_service_1.CategoryService();
        await expect(categoryService.getCategoryById(999)).rejects.toBeInstanceOf(not_found_error_1.NotFoundError);
        expect(mockedRepository.getById).toHaveBeenCalledWith(999);
    });
});
