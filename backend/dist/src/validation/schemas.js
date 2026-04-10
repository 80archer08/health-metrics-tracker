"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricCreateSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.metricCreateSchema = zod_1.z.object({
    date: zod_1.z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid date" }),
    heartRate: zod_1.z.number().int().positive().optional(),
    steps: zod_1.z.number().int().nonnegative().optional(),
    sleepHours: zod_1.z.number().positive().optional(),
    calories: zod_1.z.number().int().nonnegative().optional(),
    weight: zod_1.z.number().positive().optional(),
    bloodPressureSys: zod_1.z.number().int().positive().optional(),
    bloodPressureDia: zod_1.z.number().int().positive().optional(),
    glucose: zod_1.z.number().int().positive().optional(),
});
//# sourceMappingURL=schemas.js.map