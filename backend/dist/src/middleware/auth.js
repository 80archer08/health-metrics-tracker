"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "changeme";
function requireAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const token = auth.slice(7);
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (typeof payload !== "object" || !payload || !("sub" in payload)) {
            return res.status(401).json({ error: "Invalid token payload" });
        }
        req.user = payload;
        return next();
    }
    catch {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}
//# sourceMappingURL=auth.js.map