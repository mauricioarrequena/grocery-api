import { Router } from "express";
import categoryRoutes from "./category.routes";

const v1Router = Router();
v1Router.use(categoryRoutes);

export default v1Router;
