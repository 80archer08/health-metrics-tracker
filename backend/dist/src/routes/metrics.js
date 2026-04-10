"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const schemas_1 = require("../validation/schemas");
const prisma_1 = require("../utils/prisma");
const router = (0, express_1.Router)();
router.get("/", auth_1.requireAuth, async (req, res, next) => {
    try {
        const userId = Number(req.user?.sub);
        const metrics = await prisma_1.prisma.healthMetric.findMany({
            where: { userId },
            orderBy: { date: "desc" },
        });
        return res.json(metrics);
    }
    catch (err) {
        next(err);
    }
});
router.post("/", auth_1.requireAuth, (0, validate_1.validate)(schemas_1.metricCreateSchema), async (req, res, next) => {
    try {
        const userId = Number(req.user?.sub);
        const parsed = schemas_1.metricCreateSchema.parse(req.body);
        const metric = await prisma_1.prisma.healthMetric.create({
            data: {
                userId,
                date: new Date(parsed.date),
                heartRate: parsed.heartRate ?? null,
                steps: parsed.steps ?? null,
                sleepHours: parsed.sleepHours ?? null,
                calories: parsed.calories ?? null,
                weight: parsed.weight ?? null,
                bloodPressureSys: parsed.bloodPressureSys ?? null,
                bloodPressureDia: parsed.bloodPressureDia ?? null,
                glucose: parsed.glucose ?? null,
            },
        });
        return res.status(201).json(metric);
    }
    catch (err) {
        next(err);
    }
});
router.delete("/:id", auth_1.requireAuth, async (req, res, next) => {
    try {
        const userId = Number(req.user?.sub);
        const metricId = Number(req.params.id);
        const found = await prisma_1.prisma.healthMetric.findUnique({ where: { id: metricId } });
        if (!found) {
            return res.status(404).json({ error: "Not found" });
        }
        if (found.userId !== userId) {
            return res.status(403).json({ error: "Forbidden" });
        }
        await prisma_1.prisma.healthMetric.delete({ where: { id: metricId } });
        return res.status(204).send();
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=metrics.js.map