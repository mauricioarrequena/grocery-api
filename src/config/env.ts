const requiredEnvVars = [
  "DB_HOST",
  "DB_PORT",
  "DB_USERNAME",
  "DB_PASSWORD",
  "DB_NAME",
];

requiredEnvVars.forEach((emvKeyName) => {
  if (!process.env[emvKeyName]) {
    throw new Error(`ERROR: Missing required environment variable: ${emvKeyName}`);
  }
});

const port = Number(process.env.PORT);
export const env = {
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: Number(process.env.DB_PORT),
  DB_USERNAME: process.env.DB_USERNAME!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_NAME: process.env.DB_NAME!,
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number.isNaN(port) ? 3000 : port,
};