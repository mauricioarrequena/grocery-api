"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock("../../src/services/category.service");
const category_controller_1 = require("../../src/controllers/category.controller");
const category_service_1 = require("../../src/services/category.service");
const not_found_error_1 = require("../../src/errors/not-found.error");
describe("CategoryController", () => {
    it("should return a category wtih status 200 when it exits", async () => {
        const mockCategory = { id: 1, name: "Fruits" };
        const req = { params: { id: "1" } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        const mockedServiceInstance = category_service_1.CategoryService.mock
            .instances[0];
        mockedServiceInstance.getCategoryById = jest
            .fn()
            .mockResolvedValue(mockCategory);
        await (0, category_controller_1.getCategoryById)(req, res);
        expect(mockedServiceInstance.getCategoryById).toHaveBeenCalledWith(1);
        expect(res.json).toHaveBeenCalledWith(mockCategory);
    });
    it("shoud return a 404 when the category is not found", async () => {
        const req = { params: { id: "999" } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
        const mockedServiceInstance = category_service_1.CategoryService.mock
            .instances[0];
        mockedServiceInstance.getCategoryById = jest
            .fn()
            .mockRejectedValue(new not_found_error_1.NotFoundError("Category not found"));
        await (0, category_controller_1.getCategoryById)(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Category not found" });
    });
});
