"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const auth_1 = require("./auth");
async function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.slice(7);
    try {
        const payload = (0, auth_1.verifyToken)(token);
        req.user = { id: payload.sub };
        next();
    }
    catch {
        return res.status(401).json({ error: "Unauthorized" });
    }
}
