"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasksRouter = void 0;
const express_1 = require("express");
const services_1 = require("../services");
exports.tasksRouter = (0, express_1.Router)();
exports.tasksRouter.post("/api/tasks/generate", async (req, res) => {
    const { uni } = req.body;
    if (typeof uni !== "object" ||
        uni === null ||
        typeof uni.name !== "string" ||
        !uni.name.trim()) {
        return res.status(400).json({
            error: "uni is required and must be an object with a non-empty name string",
        });
    }
    try {
        const result = await (0, services_1.generateTask)(uni);
        if (typeof result !== "string" || !result.trim()) {
            return res.status(502).json({ error: "Invalid AI response" });
        }
        return res.json({ result });
    }
    catch {
        return res.status(500).json({ error: "Failed to generate task" });
    }
});
