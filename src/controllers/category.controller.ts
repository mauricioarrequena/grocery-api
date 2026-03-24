import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";
import { NotFoundError } from "../errors/not-found.error";

const categoryService = new CategoryService();

export const getCategories = async (req: Request, res: Response) => {
  const categories = await categoryService.getCategories();

  res.json(categories);
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const category = await categoryService.getCategoryById(id);

    res.json(category);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ message: error.message });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};
