"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../services/auth");
const middleware_1 = require("../services/middleware");
exports.authRouter = (0, express_1.Router)();
exports.authRouter.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: "email and password are required strings" });
    }
    const existingUser = await (0, auth_1.findUserByEmail)(email);
    if (existingUser) {
        return res.status(409).json({ error: "User already exists" });
    }
    const user = await (0, auth_1.createUser)(email, password);
    const token = (0, auth_1.signToken)(user.id);
    return res.status(200).json({
        token,
        user: { id: user.id, email: user.email },
    });
});
exports.authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: "email and password are required strings" });
    }
    const user = await (0, auth_1.findUserByEmail)(email);
    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    const valid = await (0, auth_1.verifyPassword)(password, user.password_hash);
    if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = (0, auth_1.signToken)(user.id);
    return res.status(200).json({
        token,
        user: { id: user.id, email: user.email },
    });
});
exports.authRouter.get("/me", middleware_1.requireAuth, (req, res) => {
    return res.status(200).json(req.user);
});
