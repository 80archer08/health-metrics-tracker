"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logger_1 = __importDefault(require("../utils/logger"));
function errorHandler(err, _req, res, _next) {
    const normalized = err instanceof Error
        ? { message: err.message, stack: err.stack }
        : { message: "Unknown error", stack: undefined };
    logger_1.default.error("Unhandled error", normalized);
    const status = typeof err === "object" && err !== null && "status" in err && typeof err.status === "number"
        ? err.status
        : 500;
    res.status(status).json({ error: normalized.message || "Internal Server Error" });
}
//# sourceMappingURL=errorHandler.js.map