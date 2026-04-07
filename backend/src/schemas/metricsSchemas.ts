import { z } from "zod";

export const createMetricSchema = z.object({
  date: z.string().datetime(),

  heartRate: z.number().int().positive().optional(),
  steps: z.number().int().nonnegative().optional(),
  sleepHours: z.number().positive().optional(),
  calories: z.number().int().nonnegative().optional(),
  weight: z.number().positive().optional(),
  bloodPressureSys: z.number().int().positive().optional(),
  bloodPressureDia: z.number().int().positive().optional(),
  glucose: z.number().int().positive().optional(),
});
