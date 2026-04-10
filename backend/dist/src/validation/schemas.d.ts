import { z } from "zod";
export declare const registerSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const metricCreateSchema: z.ZodObject<{
    date: z.ZodString;
    heartRate: z.ZodOptional<z.ZodNumber>;
    steps: z.ZodOptional<z.ZodNumber>;
    sleepHours: z.ZodOptional<z.ZodNumber>;
    calories: z.ZodOptional<z.ZodNumber>;
    weight: z.ZodOptional<z.ZodNumber>;
    bloodPressureSys: z.ZodOptional<z.ZodNumber>;
    bloodPressureDia: z.ZodOptional<z.ZodNumber>;
    glucose: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
//# sourceMappingURL=schemas.d.ts.map