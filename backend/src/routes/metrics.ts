import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { metricCreateSchema } from "../validation/schemas";
import { metricsController } from "../controllers/metricsController";
import { validate } from "../middleware/validate";
import { createMetricSchema } from "../schemas/metricsSchemas";
import { authMiddleware } from "../middleware/authMiddleware";

const prisma = new PrismaClient();
const router = Router();

router.get("/", metricsController.getMetrics);
router.post("/", validate(createMetricSchema), metricsController.createMetric);
router.delete("/:id", metricsController.deleteMetric);

/** GET /api/metrics - user's metrics */
router.get("/", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const metrics = await prisma.healthMetric.findMany({
      where: { userId },
      orderBy: { date: "desc" }
    });
    res.json(metrics);
  } catch (err) {
    next(err);
  }
});

/** POST /api/metrics - add metric */
router.post("/", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId!;
    const parsed = metricCreateSchema.parse(req.body);
    const metric = await prisma.healthMetric.create({
      data: {
        userId,
        date: new Date(parsed.date),
        heartRate: parsed.heartRate ?? null,
        bloodPressureSys: parsed.bloodPressureSys ?? null,
        bloodPressureDia: parsed.bloodPressureDia ?? null,
        glucose: parsed.glucose ?? null
      }
    });
    res.status(201).json(metric);
  } catch (err) {
    next(err);
  }
});

/** DELETE /api/metrics/:id */
router.delete("/:id", requireAuth, async (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    // Ensure ownership
    const found = await prisma.healthMetric.findUnique({ where: { id } });
    if (!found) return res.status(404).json({ error: "Not found" });
    if (found.userId !== userId) return res.status(403).json({ error: "Forbidden" });

    await prisma.healthMetric.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
