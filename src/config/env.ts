import dotenv from "dotenv";
dotenv.config();

const requiredEnvVariables = [
  "DB_HOST",
  "DB_PORT",
  "DB_USERNAME",
  "DB_PASSWORD",
  "DB_NAME",
];

requiredEnvVariables.forEach((envKeyName) => {
  if (!process.env[envKeyName]) {
    throw new Error(
      `ERROR: Missing required environment variable: ${envKeyName}`
    );
  }
});

const port = Number(process.env.PORT);

export const env = {
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: Number(process.env.DB_PORT),
  DB_USERNAME: process.env.DB_USERNAME!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_NAME: process.env.DB_NAME!,
  NODE_ENV: process.env.NODE_ENV!, // optional but now just a normal variable inside .env
  PORT: Number.isNaN(port) ? 3000 : port,
};