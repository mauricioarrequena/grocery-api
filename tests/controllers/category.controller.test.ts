jest.mock("../../src/services/category.service");
import { Request, Response } from "express";
import { getCategoryById } from "../../src/controllers/category.controller";
import { CategoryService } from "../../src/services/category.service";
import { NotFoundError } from "../../src/errors/not-found.error";

describe("CategoryController", () => {
  it("should return a category wtih status 200 when it exits", async () => {
    const mockCategory = { id: 1, name: "Fruits" };
    const req = { params: { id: "1" } } as unknown as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
    const mockedServiceInstance = (CategoryService as jest.Mock).mock
      .instances[0];
    mockedServiceInstance.getCategoryById = jest
      .fn()
      .mockResolvedValue(mockCategory);

    await getCategoryById(req, res);

    expect(mockedServiceInstance.getCategoryById).toHaveBeenCalledWith(1);
    expect(res.json).toHaveBeenCalledWith(mockCategory);
  });

  it("shoud return a 404 when the category is not found", async () => {
    const req = { params: { id: "999" } } as unknown as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;
    const mockedServiceInstance = (CategoryService as jest.Mock).mock
      .instances[0];
    mockedServiceInstance.getCategoryById = jest
      .fn()
      .mockRejectedValue(new NotFoundError("Category not found"));

    await getCategoryById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Category not found" });
  });
});
