
import express from "express";
import { AppDataSource } from "./config/data-source";
import categoryRoutes from "./routes/category.routes";
import { env } from "./config/env";

const app = express();
const PORT = env.PORT;
app.use(express.json());
app.use("/api", categoryRoutes);

AppDataSource.initialize().then(() => {
  console.log("Database connected");

  app.listen(PORT, () => {
    console.log(`Grocery API running on port ${PORT}`);
  });
});
