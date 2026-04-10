"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../utils/prisma");
const validate_1 = require("../middleware/validate");
const schemas_1 = require("../validation/schemas");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? "7d");
router.post("/register", (0, validate_1.validate)(schemas_1.registerSchema), async (req, res, next) => {
    try {
        const parsed = schemas_1.registerSchema.parse(req.body);
        const existing = await prisma_1.prisma.user.findUnique({ where: { email: parsed.email } });
        if (existing) {
            return res.status(409).json({ error: "Email already in use" });
        }
        const hashed = await bcrypt_1.default.hash(parsed.password, 10);
        const user = await prisma_1.prisma.user.create({
            data: { name: parsed.name, email: parsed.email, password: hashed },
        });
        const token = jsonwebtoken_1.default.sign({ sub: user.id.toString() }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
        return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
    }
    catch (err) {
        next(err);
    }
});
router.post("/login", (0, validate_1.validate)(schemas_1.loginSchema), async (req, res, next) => {
    try {
        const parsed = schemas_1.loginSchema.parse(req.body);
        const user = await prisma_1.prisma.user.findUnique({ where: { email: parsed.email } });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const isValid = await bcrypt_1.default.compare(parsed.password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ sub: user.id.toString() }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
        return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map