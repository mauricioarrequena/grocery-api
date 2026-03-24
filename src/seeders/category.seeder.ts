import { AppDataSource } from "../config/data-source";
import { Category } from "../entities/category.entity";

async function seed() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(Category);

  const categories = [
    { name: "Fruits" },
    { name: "Vegetables" },
    { name: "Dairy" },
    { name: "Bakery" },
    { name: "Meat" },
  ];

  await repo.upsert(categories, ["name"]);

  console.log("Categories seeded");
  process.exit(0);
}

seed();