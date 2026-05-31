import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
