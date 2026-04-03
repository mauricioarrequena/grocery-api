import "reflect-metadata";
import { DataSource } from "typeorm";
import "dotenv/config";

const isProduction = process.env.NODE_ENV === "production";
export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    isProduction
      ? "dist/entities/**/*.js"
      : "src/entities/**/*.ts",
  ],
  migrations: [
    isProduction
      ? "dist/migrations/**/*.js"
      : "src/migrations/**/*.ts",
  ],
  subscribers: [],
  logging: false,
  synchronize: false,
});