"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.findUserByEmail = findUserByEmail;
exports.verifyPassword = verifyPassword;
exports.signToken = signToken;
exports.verifyToken = verifyToken;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("./db");
async function createUser(email, password) {
    const password_hash = await bcrypt_1.default.hash(password, 10);
    const result = await (0, db_1.query)("INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at", [email, password_hash]);
    return result.rows[0];
}
async function findUserByEmail(email) {
    const result = await (0, db_1.query)("SELECT * FROM users WHERE email = $1", [email]);
    return result.rows[0] ?? null;
}
async function verifyPassword(plain, hash) {
    return bcrypt_1.default.compare(plain, hash);
}
function signToken(userId) {
    return jsonwebtoken_1.default.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}
function verifyToken(token) {
    const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    if (typeof payload.sub !== "string") {
        throw new Error("Invalid token");
    }
    return { sub: payload.sub };
}
