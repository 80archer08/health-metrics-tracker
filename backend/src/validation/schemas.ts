import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const metricCreateSchema = z.object({
  date: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid date" }),
  heartRate: z.number().int().positive().optional(),
  bloodPressureSys: z.number().int().positive().optional(),
  bloodPressureDia: z.number().int().positive().optional(),
  glucose: z.number().positive().optional()
});
