import "reflect-metadata";
import { DataSource } from "typeorm";
import { Category } from "../entities/category.entity";
import { env } from "./env";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [Category],
  migrations: [],
  subscribers: [],
});
