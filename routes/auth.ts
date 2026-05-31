import { Router } from "express";
import { createUser, findUserByEmail, signToken, verifyPassword } from "../services/auth";
import { requireAuth } from "../services/middleware";

export const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "email and password are required strings" });
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ error: "User already exists" });
  }

  const user = await createUser(email, password);
  const token = signToken(user.id);

  return res.status(200).json({
    token,
    user: { id: user.id, email: user.email },
  });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "email and password are required strings" });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = signToken(user.id);

  return res.status(200).json({
    token,
    user: { id: user.id, email: user.email },
  });
});

authRouter.get("/me", requireAuth, (req, res) => {
  return res.status(200).json(req.user);
});
