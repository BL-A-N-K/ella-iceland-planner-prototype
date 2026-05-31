import { NextFunction, Request, Response } from "express";
import { verifyToken } from "./auth";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub };
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
