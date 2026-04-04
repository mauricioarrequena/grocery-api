import { Router } from "express";
import {
  listCategories,
  createCategory,
  getCategoryById,
} from "../../controllers/category.controller";
import { requireJsonContentType } from "../../middleware/require-json.middleware";

const router = Router();

router.get("/categories", listCategories);
router.post("/categories", requireJsonContentType, createCategory);
router.get("/categories/:id", getCategoryById);

export default router;
