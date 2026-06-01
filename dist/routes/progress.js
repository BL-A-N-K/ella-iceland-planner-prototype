"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.progressRouter = void 0;
const express_1 = require("express");
const db_1 = require("../services/db");
const middleware_1 = require("../services/middleware");
exports.progressRouter = (0, express_1.Router)();
exports.progressRouter.get("/", middleware_1.requireAuth, async (req, res) => {
    const result = await (0, db_1.query)("SELECT task_id, done FROM progress WHERE user_id = $1", [req.user.id]);
    const progressMap = {};
    for (const row of result.rows) {
        progressMap[row.task_id] = row.done;
    }
    return res.status(200).json(progressMap);
});
exports.progressRouter.put("/:taskId", middleware_1.requireAuth, async (req, res) => {
    const { done } = req.body;
    if (typeof done !== "boolean") {
        return res.status(400).json({ error: "done is required and must be a boolean" });
    }
    await (0, db_1.query)(`INSERT INTO progress (user_id, task_id, done, updated_at)
     VALUES ($1, $2, $3, now())
     ON CONFLICT (user_id, task_id)
     DO UPDATE SET done = EXCLUDED.done, updated_at = now()`, [req.user.id, req.params.taskId, done]);
    return res.status(204).send();
});
