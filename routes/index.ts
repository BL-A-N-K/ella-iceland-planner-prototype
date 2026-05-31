/**
 * ROUTES layer — HTTP handling only.
 * Input validation and output formatting belong here.
 */

import { Router } from "express";
import { authRouter } from "./auth";
import { progressRouter } from "./progress";
import { universitiesRouter } from "./universities";

export const routes = Router();

routes.use("/auth", authRouter);
routes.use("/universities", universitiesRouter);
routes.use("/progress", progressRouter);
