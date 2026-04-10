"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const errorHandler_1 = require("./middleware/errorHandler");
const auth_1 = __importDefault(require("./routes/auth"));
const metrics_1 = __importDefault(require("./routes/metrics"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.get("/api/healthcheck", (_req, res) => {
    res.json({ status: "OK" });
});
if (process.env.NODE_ENV !== "test") {
    app.use("/api", auth_1.default);
    app.use("/api/metrics", metrics_1.default);
}
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map