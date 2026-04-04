import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../services/category.service";
import { ApiError } from "../errors/api.error";

const categoryService = new CategoryService();

export const listCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await categoryService.listCategories(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await categoryService.createCategory(req.body);
    res
      .status(201)
      .location(`/api/v1/categories/${data.id}`)
      .json({ data });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      throw new ApiError(400, "VALIDATION_ERROR", "Request validation failed", [
        {
          field: "id",
          message: "must be a positive integer",
          code: "INVALID_ID",
        },
      ]);
    }
    const data = await categoryService.getCategoryById(id);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};
