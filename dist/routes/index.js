"use strict";
/**
 * ROUTES layer — HTTP handling only.
 * Input validation and output formatting belong here.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const auth_1 = require("./auth");
const progress_1 = require("./progress");
const universities_1 = require("./universities");
exports.routes = (0, express_1.Router)();
exports.routes.use("/auth", auth_1.authRouter);
exports.routes.use("/universities", universities_1.universitiesRouter);
exports.routes.use("/progress", progress_1.progressRouter);
