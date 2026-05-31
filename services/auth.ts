import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "./db";

export async function createUser(email: string, password: string) {
  const password_hash = await bcrypt.hash(password, 10);
  const result = await query(
    "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at",
    [email, password_hash]
  );
  return result.rows[0];
}

export async function findUserByEmail(email: string) {
  const result = await query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0] ?? null;
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

export function verifyToken(token: string): { sub: string } {
  const payload = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
  if (typeof payload.sub !== "string") {
    throw new Error("Invalid token");
  }
  return { sub: payload.sub };
}
