"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.pool = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = __importDefault(require("pg"));
dotenv_1.default.config();
exports.pool = new pg_1.default.Pool({
    connectionString: process.env.DATABASE_URL,
});
const query = (text, params) => exports.pool.query(text, params);
exports.query = query;
