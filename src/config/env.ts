import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

function requireEnv(name: string, fallback?: string) {
  const val = process.env[name] ?? fallback;
  if (val === undefined) throw new Error(`Missing env var: ${name}`);
  return val;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(requireEnv("PORT", "3000")),
  db: {
    host: requireEnv("DB_HOST", "127.0.0.1"),
    port: Number(requireEnv("DB_PORT", "8889")),
    user: requireEnv("DB_USER", "root"),
    password: requireEnv("DB_PASSWORD", "root"),
    database: requireEnv("DB_NAME", "pray_for_me"),
  },
};
