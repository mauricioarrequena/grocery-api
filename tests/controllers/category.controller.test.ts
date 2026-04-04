const mockCategoryService = {
  listCategories: jest.fn(),
  createCategory: jest.fn(),
  getCategoryById: jest.fn(),
};

jest.mock("../../src/services/category.service", () => ({
  CategoryService: jest
    .fn()
    .mockImplementation(() => mockCategoryService),
}));

import { Request, Response, NextFunction } from "express";
import {
  listCategories,
  createCategory,
  getCategoryById,
} from "../../src/controllers/category.controller";
import { NotFoundError } from "../../src/errors/not-found.error";
import { ApiError } from "../../src/errors/api.error";

describe("CategoryController", () => {
  const createdAt = "2026-04-01T10:00:00.000Z";
  const updatedAt = "2026-04-01T10:00:00.000Z";

  beforeEach(() => {
    mockCategoryService.listCategories.mockClear();
    mockCategoryService.createCategory.mockClear();
    mockCategoryService.getCategoryById.mockClear();
  });

  it("should return categories with status 200", async () => {
    const payload = {
      data: [
        { id: 1, name: "Fruits", createdAt, updatedAt },
        { id: 2, name: "Vegetables", createdAt, updatedAt },
      ],
      meta: { total: 2, limit: 50, offset: 0 },
    };
    const req = { query: {} } as unknown as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;
    mockCategoryService.listCategories.mockResolvedValue(payload);

    await listCategories(req, res, next);

    expect(mockCategoryService.listCategories).toHaveBeenCalledWith(req.query);
    expect(res.json).toHaveBeenCalledWith(payload);
    expect(next).not.toHaveBeenCalled();
  });

  it("should create a category with 201 and Location header", async () => {
    const data = { id: 5, name: "Pantry", createdAt, updatedAt };
    const req = { body: { name: "Pantry" } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      location: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;
    mockCategoryService.createCategory.mockResolvedValue(data);

    await createCategory(req, res, next);

    expect(mockCategoryService.createCategory).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.location).toHaveBeenCalledWith("/api/v1/categories/5");
    expect(res.json).toHaveBeenCalledWith({ data });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return a category with status 200 when it exists", async () => {
    const data = { id: 1, name: "Fruits", createdAt, updatedAt };
    const req = { params: { id: "1" } } as unknown as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;
    mockCategoryService.getCategoryById.mockResolvedValue(data);

    await getCategoryById(req, res, next);

    expect(mockCategoryService.getCategoryById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith({ data });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next when the category is not found", async () => {
    const req = { params: { id: "999" } } as unknown as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;
    const notFound = new NotFoundError("Category not found");
    mockCategoryService.getCategoryById.mockRejectedValue(notFound);

    await getCategoryById(req, res, next);

    expect(next).toHaveBeenCalledWith(notFound);
  });

  it("should call next with ApiError for invalid id", async () => {
    const req = { params: { id: "abc" } } as unknown as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    await getCategoryById(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(mockCategoryService.getCategoryById).not.toHaveBeenCalled();
  });
});
