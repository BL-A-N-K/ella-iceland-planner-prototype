"use strict";
/**
 * BOOTSTRAP layer — application initialization only.
 * Server setup and middleware registration.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const routes_1 = require("../routes");
exports.app = (0, express_1.default)();
const port = Number(process.env.PORT) || 3000;
exports.app.use((0, cors_1.default)({
    origin: [
        "https://preview--ellasicelandstudyplan.lovable.app",
        "https://ellasicelandstudyplan.lovable.app",
        process.env.FRONTEND_URL ?? "",
    ].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
exports.app.use(express_1.default.json());
exports.app.use(routes_1.routes);
exports.app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
