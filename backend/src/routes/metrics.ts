import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { metricCreateSchema } from "../validation/schemas.js";
import { prisma } from "../utils/prisma.js";

const router = Router();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const userId = Number(req.user?.sub);
    const metrics = await prisma.healthMetric.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });

    return res.json(metrics);
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, validate(metricCreateSchema), async (req, res, next) => {
  try {
    const userId = Number(req.user?.sub);
    const parsed = metricCreateSchema.parse(req.body);

    const metric = await prisma.healthMetric.create({
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
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const userId = Number(req.user?.sub);
    const metricId = Number(req.params.id);

    const found = await prisma.healthMetric.findUnique({ where: { id: metricId } });

    if (!found) {
      return res.status(404).json({ error: "Not found" });
    }

    if (found.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await prisma.healthMetric.delete({ where: { id: metricId } });
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
