import express from "express";
import { AppDataSource } from "./config/data-source";
import v1Routes from "./routes/v1";
import { errorHandler } from "./middleware/error-handler.middleware";
import { env } from "./config/env";

const app = express();
const PORT = env.PORT;
app.use(express.json());
app.use("/api/v1", v1Routes);
app.use(errorHandler);

AppDataSource.initialize().then(() => {
  console.log("Database connected");

  app.listen(PORT, () => {
    console.log(`Grocery API running on port ${PORT}`);
  });
});
