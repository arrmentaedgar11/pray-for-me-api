// src/db/pool.ts
import mysql from "mysql2/promise";
import { env } from "../config/env"; //nested db project

let pool: mysql.Pool;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: env.db.host,
      port: env.db.port ?? 3306,
      user: env.db.user,
      password: env.db.password,
      database: env.db.database,
      waitForConnections: true,
      connectionLimit: 10,
      
      // Allow emojis
      charset: "utf8mb4",
    });
  }
  return pool;
}

